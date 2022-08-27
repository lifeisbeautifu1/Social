"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        throw new errors_1.UnauthorizedError('Unauthenticated');
    const { id } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    res.locals.user = { id };
    next();
    // const { authorization } = req.headers;
    // if (!authorization || !authorization.startsWith('Bearer')) {
    //   throw new UnauthorizedError('Token not provided');
    // } else {
    //   const token = authorization.split(' ')[1];
    //   try {
    //     const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as {
    //       id: string;
    //     };
    //     req.user = {
    //       id,
    //     };
    //     next();
    //   } catch (error) {
    //     throw new UnauthorizedError('Invalid/Expired token');
    //   }
    // }
};
exports.default = auth;
