import { StatusCodes } from 'http-status-codes';

const notFoundMiddleware = (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ message: 'The page you are looking for does not exist.' });
};

export default notFoundMiddleware;
