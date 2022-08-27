"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, 'Please provide username'],
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Please provide email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 8,
    },
    messageNotifications: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'MessageNotification',
        },
    ],
    postNotifications: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'PostNotification',
        },
    ],
    profilePicture: {
        type: String,
        default: 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1660727184/dquestion_app_widget_1_b_i7bjjo.png',
    },
    coverPicture: {
        type: String,
        default: 'https://res.cloudinary.com/dxf7urmsh/image/upload/v1659264833/16588370472353_vy1sjr.jpg',
    },
    desc: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: 'City ...',
    },
    from: {
        type: String,
        default: 'From ...',
    },
    relationship: {
        type: Number,
        default: 1,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    friendRequests: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'FriendRequest',
        },
    ],
    friends: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    following: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        },
    ],
    followers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        },
    ],
}, {
    timestamps: true,
});
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
