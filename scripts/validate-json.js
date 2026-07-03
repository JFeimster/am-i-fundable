import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = listFiles(root).filter((file) => file.endsWith(".json"));
let failed = false;

for (const file of files) {
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
    console.log(`JSON OK  ${path.relative(root, file)}`);
  } catch (error) {
    failed = true;
    console.error(`JSON INVALID  ${path.relative(root, file)}  ${error.message}`);
  }
}

if (failed) process.exit(1);

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
