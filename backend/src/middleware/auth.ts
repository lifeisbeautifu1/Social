import { UnauthorizedError } from '../errors';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorizedError('Token not provided');
  } else {
    const token = authorization.split(' ')[1];
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
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
