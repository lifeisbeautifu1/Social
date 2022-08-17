"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageNotificationSchema = new mongoose_1.default.Schema({
    conversation: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Conversation',
    },
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
const MessageNotification = mongoose_1.default.model('MessageNotification', MessageNotificationSchema);
exports.default = MessageNotification;
