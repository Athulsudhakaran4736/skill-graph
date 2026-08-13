export const errorHandler = (error, req, res, next) => {
  console.error("Request failed:", error.message);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,

    message:
      statusCode === 500
        ? "Something went wrong while processing the request."
        : error.message,
  });
};
