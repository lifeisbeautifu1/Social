import { BadRequestError, NotFoundError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.js';

export const register = async (req, res) => {
  // const { username, password, email } = req.body;

  // if (!username || !password || !email) {
  //   throw BadRequestError('Please provide all fields!');
  // }

  // const user = await User.create({
  //   username,
  //   password,
  //   email,
  // });

  const user = await User.create(req.body);

  res.status(StatusCodes.OK).json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide all fields.');
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new NotFoundError(`User with ${email} doesn't exist`);
  }

  const isPasswordMatch = await user.comparePasswords(password);

  if (!isPasswordMatch) throw new BadRequestError('Incorrect password');

  res.status(StatusCodes.OK).json(user);
};
