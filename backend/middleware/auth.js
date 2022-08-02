import { UnauthorizedError } from '../errors/index.js';
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorizedError('Token not provided');
  } else {
    const token = authorization.split(' ')[1];
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        id,
      };
      next();
    } catch (error) {
      throw new UnauthorizedError('Invalid/Expired token');
    }
  }
};

export default auth;
