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
exports.getConversation = exports.getConversations = exports.createConversation = void 0;
const conversation_1 = __importDefault(require("../models/conversation"));
const http_status_codes_1 = require("http-status-codes");
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield conversation_1.default.findOne({
        $or: [
            { members: [res.locals.user.id, req.params.id] },
            { members: [req.params.id, res.locals.user.id] },
        ],
    });
    if (!exist) {
        const conversation = yield conversation_1.default.create({
            members: [res.locals.user.id, req.params.id],
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json(conversation);
    }
    else {
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: 'Conversation alerady exist' });
    }
});
exports.createConversation = createConversation;
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversations = yield conversation_1.default.find({
        members: {
            $in: [res.locals.user.id],
        },
    }).populate('members', 'profilePicture username');
    res.status(http_status_codes_1.StatusCodes.OK).json(conversations);
});
exports.getConversations = getConversations;
const getConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield conversation_1.default.findById(req.params.id).populate('members', 'profilePicture username');
    res.status(http_status_codes_1.StatusCodes.OK).json(conversation);
});
exports.getConversation = getConversation;
