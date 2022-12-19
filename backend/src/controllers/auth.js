"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.verifyAccount = exports.logout = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const validators_1 = require("../config/validators");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const user_1 = __importDefault(require("../models/user"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, email, password, confirmPassword } = req.body;
    const { errors, valid } = (0, validators_1.validateRegisterInput)(username, email, password, confirmPassword);
    if (valid) {
        let exist = yield user_1.default.findOne({ username });
        if (exist) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errors: {
                    username: `User with username ${username} already exist`,
                },
            });
        }
        exist = yield user_1.default.findOne({ email });
        if (exist) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errors: {
                    email: `User with email ${email} already exist`,
                },
            });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const password = yield bcryptjs_1.default.hash(req.body.password, salt);
        const token = jsonwebtoken_1.default.sign({ username, email, password }, process.env.JWT_SECRET, { expiresIn: '20m' });
        const mg = (0, mailgun_js_1.default)({
            apiKey: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN,
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
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
            }
            console.log(body);
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: 'Please verify email' });
        });
    }
    else {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const { errors, valid } = (0, validators_1.validateLoginInput)(username, password);
    if (valid) {
        let user = yield user_1.default.findOne({
            username,
        })
            .populate('friends', 'username profilePicture')
            .populate('friendRequests', 'from to createdAt')
            .populate('messageNotifications', 'createdAt conversation from to')
            .populate('postNotifications', 'post createdAt user type');
        user = yield user_1.default.populate(user, {
            path: 'friendRequests.from',
            select: 'username profilePicture',
        });
        user = yield user_1.default.populate(user, {
            path: 'friendRequests.to',
            select: 'username profilePicture',
        });
        user = yield user_1.default.populate(user, {
            path: 'messageNotifications.from',
            select: 'username profilePicture',
        });
        user = yield user_1.default.populate(user, {
            path: 'postNotifications.user',
            select: 'username profilePicture',
        });
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errors: {
                    username: `User with username ${username} not found`,
                },
            });
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                errors: {
                    password: `Password is incorrect`,
                },
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.set('Set-Cookie', cookie_1.default.serialize('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 3600 * 24 * 7,
            path: '/',
        }));
        res.status(http_status_codes_1.StatusCodes.OK).json(Object.assign({}, user._doc));
    }
    else {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ errors });
    }
});
exports.login = login;
const logout = (req, res) => {
    res.set('Set-Cookie', cookie_1.default.serialize('token', '', {
        httpOnly: true,
        secure: true,
        maxAge: +new Date(0),
        sameSite: 'none',
        path: '/',
    }));
    res.json({ message: 'Logout' });
};
exports.logout = logout;
const verifyAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { token } = req.body;
    const { email, username, password } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    yield user_1.default.create({
        username,
        email,
        password,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'success',
    });
});
exports.verifyAccount = verifyAccount;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_1.default.findOne({ email });
    if (!user)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: {
                email: `User with email ${email} not found.`,
            },
        });
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '20m',
    });
    const mg = (0, mailgun_js_1.default)({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
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
    const body = yield mg.messages().send(data);
    console.log(body);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'success' });
});
exports.resetPassword = resetPassword;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirmPassword, token } = req.body;
    if (!password.trim())
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: {
                password: 'New password must not be empty',
            },
        });
    if (password.length < 6)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: {
                password: 'New password must be at least 6 characters long.',
            },
        });
    if (confirmPassword !== password)
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            errors: {
                confirmPassword: 'Passwords do not match',
            },
        });
    const { id } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    yield user_1.default.findByIdAndUpdate(id, {
        password: hashedPassword,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: 'Password successfully been updated',
    });
});
exports.updatePassword = updatePassword;
