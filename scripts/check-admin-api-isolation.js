import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const openapiDir = path.join(root, "schemas", "openapi");
const publicRegistryPath = path.join(root, "config", "api", "public-api.registry.json");
const gptRegistryPath = path.join(root, "config", "api", "gpt-actions.registry.json");

const issues = [];

if (fs.existsSync(openapiDir)) {
  for (const fileName of fs.readdirSync(openapiDir).filter((file) => file.endsWith(".yaml"))) {
    const filePath = path.join(openapiDir, fileName);
    const raw = fs.readFileSync(filePath, "utf8");

    if (raw.includes("/api/admin/")) {
      issues.push(`/schemas/openapi/${fileName} exposes an admin route path.`);
    }

    if (/operationId:\s*admin[A-Za-z0-9_-]*/.test(raw)) {
      issues.push(`/schemas/openapi/${fileName} exposes an admin operation ID.`);
    }
  }
} else {
  issues.push("Missing /schemas/openapi directory.");
}

if (fs.existsSync(publicRegistryPath)) {
  const registry = JSON.parse(fs.readFileSync(publicRegistryPath, "utf8"));
  for (const entry of registry.entries || []) {
    if (String(entry.path || "").startsWith("/api/admin/")) {
      issues.push("Public API registry contains an admin route.");
    }
    if (entry.visibility === "server_side_internal") {
      issues.push(`Public API registry contains internal route visibility for ${entry.id || entry.path}.`);
    }
  }
}

if (fs.existsSync(gptRegistryPath)) {
  const registry = JSON.parse(fs.readFileSync(gptRegistryPath, "utf8"));
  const serialized = JSON.stringify(registry);
  if (serialized.includes("/api/admin/")) {
    issues.push("GPT actions registry references an admin route path.");
  }
  if (/"admin[A-Za-z0-9_-]*"/.test(serialized)) {
    const allowedText = JSON.stringify(registry.doNotExposeOperations || []);
    const withoutAllowedList = serialized.replace(allowedText, "");
    if (/"admin[A-Za-z0-9_-]*"/.test(withoutAllowedList)) {
      issues.push("GPT actions registry appears to expose an admin operation outside the do-not-expose list.");
    }
  }
}

if (issues.length > 0) {
  console.error("Admin API isolation check failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log("Admin API isolation check passed.");
