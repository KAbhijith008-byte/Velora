export function errorHandler(err, req, res, next) {
  // Force the error to print fully in Render logs
  console.error("❌ ROUTE ERROR:", err.stack || err.message);

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}