const branch = process.env.VERCEL_GIT_COMMIT_REF || "";

if (branch && branch !== "main") {
  console.log(`Ignoring Vercel preview deployment for branch: ${branch}`);
  process.exit(0);
}

console.log(`Allowing Vercel build check for branch: ${branch || "unknown"}`);
process.exit(1);
