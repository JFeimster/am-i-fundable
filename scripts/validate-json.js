import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = listFiles(root).filter((file) => file.endsWith(".json"));
const invalid = [];

for (const file of files) {
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    invalid.push({ file, message: error.message });
  }
}

if (invalid.length) {
  console.error(`JSON validation failed for ${invalid.length} of ${files.length} files:`);
  invalid.forEach(({ file, message }) => {
    console.error(`JSON INVALID  ${path.relative(root, file)}  ${message}`);
  });
  process.exit(1);
}

console.log(`JSON validation passed for ${files.length} files.`);

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
