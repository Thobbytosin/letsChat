export const errorHandler = (res, statusCode, message) => {
  const error = new Error();
  error.message = message;
  error.statusCode = statusCode;

  return res
    .status(error.statusCode)
    .json({ success: false, message: error.message });
};
