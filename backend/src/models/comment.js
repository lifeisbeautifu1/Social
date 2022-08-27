"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
    postId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Post',
    },
    body: {
        type: String,
        required: [true, 'Please provide comment body'],
        trim: true,
    },
}, {
    timestamps: true,
});
const Comment = mongoose_1.default.model('Comment', CommentSchema);
exports.default = Comment;
