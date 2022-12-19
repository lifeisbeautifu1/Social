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
exports.closeRequest = exports.createRequest = void 0;
const friendRequest_1 = __importDefault(require("../models/friendRequest"));
const http_status_codes_1 = require("http-status-codes");
const user_1 = __importDefault(require("../models/user"));
const createRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { to } = req.body;
    const newFriendRequest = yield friendRequest_1.default.create({
        from: res.locals.user.id,
        to,
    });
    yield user_1.default.findByIdAndUpdate(to, {
        $push: {
            // @ts-ignore
            friendRequests: newFriendRequest,
        },
    });
    yield user_1.default.findByIdAndUpdate(res.locals.user.id, {
        $push: {
            // @ts-ignore
            friendRequests: newFriendRequest,
        },
    });
    const friendRequest = yield friendRequest_1.default.findById(newFriendRequest)
        .populate('from', 'username profilePicture')
        .populate('to', 'username profilePicture');
    res.status(http_status_codes_1.StatusCodes.OK).json(friendRequest);
});
exports.createRequest = createRequest;
const closeRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: requestId } = req.params;
    const { status } = req.body;
    const friendRequest = yield friendRequest_1.default.findById(requestId);
    if (status.toLowerCase() === 'accept') {
        const user = yield user_1.default.findByIdAndUpdate(friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest.to, {
            $push: {
                // @ts-ignore
                friends: friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest.from,
            },
            $pull: {
                // @ts-ignore
                friendRequests: friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest._id,
            },
        }, {
            new: true,
            runValidators: true,
        });
        yield user_1.default.findByIdAndUpdate(friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest.from, {
            $push: {
                // @ts-ignore
                friends: friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest.to,
            },
            $pull: {
                // @ts-ignore
                friendRequests: friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest._id,
            },
        });
        const newFriend = yield user_1.default.findById(friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest.from).select('username profilePicture');
        yield (friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest.remove());
        res.status(http_status_codes_1.StatusCodes.OK).json(newFriend);
    }
    else {
        const user = yield user_1.default.findByIdAndUpdate(friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest.to, {
            $pull: {
                // @ts-ignore
                friendRequests: friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest._id,
            },
        });
        yield user_1.default.findByIdAndUpdate(friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest.from, {
            $pull: {
                // @ts-ignore
                friendRequests: friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest._id,
            },
        });
        yield (friendRequest === null || friendRequest === void 0 ? void 0 : friendRequest.remove());
        res.status(http_status_codes_1.StatusCodes.OK).json(user);
    }
});
exports.closeRequest = closeRequest;
