"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    desc: {
        type: String,
        maxLength: 500,
    },
    img: {
        type: String,
        default: '',
    },
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    comments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
}, {
    timestamps: true,
});
const Post = mongoose_1.default.model('Post', PostSchema);
exports.default = Post;
