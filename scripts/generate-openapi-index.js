import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const openapiDir = path.join(root, "schemas", "openapi");
const outputPath = path.join(root, "schemas", "openapi", "openapi-index.generated.json");

const index = {
  id: "openapi-index",
  generatedAt: new Date().toISOString(),
  visibility: "public_build_time_only",
  files: []
};

if (!fs.existsSync(openapiDir)) {
  console.error(`Missing OpenAPI directory: ${path.relative(root, openapiDir)}`);
  process.exit(1);
}

for (const fileName of fs.readdirSync(openapiDir).filter((file) => file.endsWith(".yaml")).sort()) {
  const filePath = path.join(openapiDir, fileName);
  const raw = fs.readFileSync(filePath, "utf8");

  const title = capture(raw, /^  title:\s*(.+)$/m);
  const version = capture(raw, /^  version:\s*(.+)$/m);
  const operationIds = [...raw.matchAll(/operationId:\s*([A-Za-z0-9_-]+)/g)].map((match) => match[1]);
  const paths = [...raw.matchAll(/^  (\/api\/[^:]+):/gm)].map((match) => match[1]);

  index.files.push({
    file: `/schemas/openapi/${fileName}`,
    title,
    version,
    operationCount: operationIds.length,
    pathCount: paths.length,
    operationIds,
    paths,
    publicActionSafe: !raw.includes("/api/admin/")
  });
}

fs.writeFileSync(outputPath, JSON.stringify(index, null, 2) + "\n");
console.log(`Generated ${path.relative(root, outputPath)} with ${index.files.length} OpenAPI files.`);

function capture(text, pattern) {
  const match = text.match(pattern);
  return match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
}
