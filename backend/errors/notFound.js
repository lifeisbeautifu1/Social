import { StatusCodes } from 'http-status-codes';
import CustomApiError from './error.js';

class NotFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default NotFoundError;
