export const errorHandler = (error, req, res, next) => {
  console.error("Request failed:", error.message);

  res.status(503).json({
    success: false,
    message: "The service is temporarily unavailable. Please try again.",
  });
};
