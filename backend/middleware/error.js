import { StatusCodes } from 'http-status-codes';
import { CustomApiError } from '../errors/index.js';

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof CustomApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
};

export default errorMiddleware;
