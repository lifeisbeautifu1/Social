"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    conversationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Conversation',
    },
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    text: {
        type: String,
        required: [true, 'Please provide message'],
    },
}, {
    timestamps: true,
});
const Message = mongoose_1.default.model('Message', MessageSchema);
exports.default = Message;
