const branch = process.env.VERCEL_GIT_COMMIT_REF || "";
const controlledBranches = new Set([
  "main",
  "repair/production-api-runtime-20260710"
]);

if (branch && !controlledBranches.has(branch)) {
  console.log(`Ignoring Vercel deployment for branch: ${branch}`);
  process.exit(0);
}

console.log(`Allowing controlled Vercel build for branch: ${branch || "unknown"}`);
process.exit(1);
