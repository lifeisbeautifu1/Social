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
exports.getMessages = exports.createMessage = void 0;
const message_1 = __importDefault(require("../models/message"));
const messageNotification_1 = __importDefault(require("../models/messageNotification"));
const user_1 = __importDefault(require("../models/user"));
const http_status_codes_1 = require("http-status-codes");
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId, sender, receiver, text } = req.body;
    const newMessage = yield message_1.default.create({
        conversationId,
        text,
        sender,
    });
    const message = yield message_1.default.findById(newMessage._id).populate('sender', 'username profilePicture');
    const notification = yield messageNotification_1.default.create({
        from: sender,
        conversation: conversationId,
        to: receiver,
    });
    yield user_1.default.findByIdAndUpdate(receiver, {
        $push: {
            // @ts-ignore
            messageNotifications: notification,
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(message);
});
exports.createMessage = createMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield message_1.default.find({
        conversationId: req.params.conversationId,
    })
        .populate('sender', 'username profilePicture')
        .sort({ createdAt: -1 });
    res.status(http_status_codes_1.StatusCodes.OK).json(messages);
});
exports.getMessages = getMessages;
