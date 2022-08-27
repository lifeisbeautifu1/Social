import { StatusCodes } from 'http-status-codes';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../config/validators';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import mailgun from 'mailgun-js';

import User from '../models/user';

export const register = async (req: Request, res: Response) => {
  let { username, email, password, confirmPassword } = req.body;

  const { errors, valid } = validateRegisterInput(
    username,
    email,
    password,
    confirmPassword
  );
  if (valid) {
    let exist = await User.findOne({ username });
    if (exist) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: {
          username: `User with username ${username} already exist`,
        },
      });
    }
    exist = await User.findOne({ email });
    if (exist) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: {
          email: `User with email ${email} already exist`,
        },
      });
    }
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const token = jwt.sign(
      { username, email, password },
      process.env.JWT_SECRET as string,
      { expiresIn: '20m' }
    );

    const mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY as string,
      domain: process.env.MAILGUN_DOMAIN as string,
    });

    const data = {
      from: 'noreply@hello.com',
      to: email,
      subject: 'Email verification',
      html: `<h1>Thank you!</h1>
        <p>In order to verify email, please proceed to the following link:
        <a href="https://project-social.netlify.app/email/confirm/${token}">Confirm email</a>
        </p>
      `,
    };

    mg.messages().send(data, function (error, body) {
      if (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
      }
      console.log(body);
      return res
        .status(StatusCodes.OK)
        .json({ message: 'Please verify email' });
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const { errors, valid } = validateLoginInput(username, password);

  if (valid) {
    let user = await User.findOne({
      username,
    })
      .populate('friends', 'username profilePicture')
      .populate('friendRequests', 'from to createdAt')
      .populate('messageNotifications', 'createdAt conversation from to')
      .populate('postNotifications', 'post createdAt user type');
    user = await User.populate(user, {
      path: 'friendRequests.from',
      select: 'username profilePicture',
    });
    user = await User.populate(user, {
      path: 'friendRequests.to',
      select: 'username profilePicture',
    });
    user = await User.populate(user, {
      path: 'messageNotifications.from',
      select: 'username profilePicture',
    });
    user = await User.populate(user, {
      path: 'postNotifications.user',
      select: 'username profilePicture',
    });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: {
          username: `User with username ${username} not found`,
        },
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errors: {
          password: `Password is incorrect`,
        },
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 3600 * 24 * 7,
        path: '/',
      })
    );

    res.status(StatusCodes.OK).json({
      // @ts-ignore
      ...user._doc,
    });
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({ errors });
  }
};

export const logout = (req: Request, res: Response) => {
  res.set(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: true,
      maxAge: +new Date(0),
      sameSite: 'none',
      path: '/',
    })
  );
  res.json({ message: 'Logout' });
};

export const verifyAccount = async (req: Request, res: Response) => {
  let { token } = req.body;

  const { email, username, password }: any = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  );

  await User.create({
    username,
    email,
    password,
  });

  res.status(StatusCodes.OK).json({
    message: 'success',
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        email: `User with email ${email} not found.`,
      },
    });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '20m',
  });

  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY as string,
    domain: process.env.MAILGUN_DOMAIN as string,
  });

  const data = {
    from: 'noreply@hello.com',
    to: email,
    subject: 'Reset Password',
    html: `
        <p>To reset your password please visit the following page:
        <a href="https://project-social.netlify.app/password/reset/${token}">Reset Password</a>
        </p>
      `,
  };

  const body = await mg.messages().send(data);

  console.log(body);

  res.status(StatusCodes.OK).json({ message: 'success' });
};

export const updatePassword = async (req: Request, res: Response) => {
  const { password, confirmPassword, token } = req.body;

  if (!password.trim())
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        password: 'New password must not be empty',
      },
    });
  if (password.length < 6)
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        password: 'New password must be at least 6 characters long.',
      },
    });
  if (confirmPassword !== password)
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        confirmPassword: 'Passwords do not match',
      },
    });

  const { id }: any = jwt.verify(token, process.env.JWT_SECRET as string);
  
  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findByIdAndUpdate(id, {
    password: hashedPassword,
  });

  res.status(StatusCodes.OK).json({
    message: 'Password successfully been updated',
  });
};