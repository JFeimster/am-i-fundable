export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: "funding-readiness-scorecard",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
}
