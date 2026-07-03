import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = listFiles(root).filter((file) => file.endsWith(".js"));
const invalid = [];

for (const file of files) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
  } catch (error) {
    invalid.push({ file, output: String(error.stderr || error.stdout || error.message || "") });
  }
}

if (invalid.length) {
  console.error(`JS syntax validation failed for ${invalid.length} of ${files.length} files:`);
  invalid.forEach(({ file, output }) => {
    console.error(`JS INVALID  ${path.relative(root, file)}`);
    if (output) process.stderr.write(output);
  });
  process.exit(1);
}

console.log(`JS syntax validation passed for ${files.length} files.`);

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules"].includes(entry.name)) return [];
      return listFiles(fullPath);
    }
    return [fullPath];
  });
}
