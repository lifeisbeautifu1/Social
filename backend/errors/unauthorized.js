import { StatusCodes } from 'http-status-codes';
import CustomApiError from './error.js';

class UnauthorizedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthorizedError;
