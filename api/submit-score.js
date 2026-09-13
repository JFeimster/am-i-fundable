import handler from "./index.js";

// Keep the historical source route as a compatibility wrapper. Vercel routes
// score submissions through the consolidated API handler in api/index.js.
export default handler;
