import { runApiRoute } from "../lib/api/http.js";
import { sendOk } from "../lib/api/response.js";

export default async function handler(req, res) {
  return runApiRoute(req, res, { methods: ["GET", "OPTIONS"] }, async () => {
    return sendOk(res, {
      service: "funding-readiness-scorecard",
      status: "healthy",
      apiVersion: "1.0.0",
      environment: process.env.VERCEL_ENV || "local",
      timestamp: new Date().toISOString()
    });
  });
}
