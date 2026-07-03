import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = listFiles(root).filter((file) => file.endsWith(".js"));
let failed = false;

for (const file of files) {
  try {
    execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    console.log(`JS OK  ${path.relative(root, file)}`);
  } catch (error) {
    failed = true;
    console.error(`JS INVALID  ${path.relative(root, file)}`);
    process.stderr.write(error.stderr || error.stdout || "");
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
