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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFriend = exports.searchUsers = exports.getFriends = exports.deleteUser = exports.updateUser = exports.getUserInfo = exports.getUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const index_1 = require("../errors/index");
const http_status_codes_1 = require("http-status-codes");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.params.id).populate('friends', 'username profilePicture');
    // @ts-ignore
    const _a = user._doc, { password, updatedAt } = _a, other = __rest(_a, ["password", "updatedAt"]);
    res.status(http_status_codes_1.StatusCodes.OK).json(other);
});
exports.getUser = getUser;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(res.locals.user.id)
        .populate('friends', 'username profilePicture')
        .populate('friendRequests', 'from to createdAt')
        .populate('messageNotifications', 'createdAt from to conversation')
        .populate('postNotifications', 'post createdAt user type')
        .select('-password');
    let fullUser = yield user_1.default.populate(user, {
        path: 'friendRequests.from',
        select: 'username profilePicture',
    });
    fullUser = yield user_1.default.populate(user, {
        path: 'friendRequests.to',
        select: 'username profilePicture',
    });
    fullUser = yield user_1.default.populate(user, {
        path: 'messageNotifications.from',
        select: 'username profilePicture',
    });
    fullUser = yield user_1.default.populate(user, {
        path: 'postNotifications.user',
        select: 'profilePicture username',
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(fullUser);
});
exports.getUserInfo = getUserInfo;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
        .populate('friends', 'profilePicture username')
        .populate('friendRequests', 'from to createdAt')
        .populate('messageNotifications', 'createdAt from to conversation')
        .populate('postNotifications', 'post createdAt user type')
        .select('-password');
    let fullUser = yield user_1.default.populate(updatedUser, {
        path: 'friendRequests.from',
        select: 'username profilePicture',
    });
    fullUser = yield user_1.default.populate(updatedUser, {
        path: 'friendRequests.to',
        select: 'username profilePicture',
    });
    fullUser = yield user_1.default.populate(updatedUser, {
        path: 'messageNotifications.from',
        select: 'username profilePicture',
    });
    fullUser = yield user_1.default.populate(updatedUser, {
        path: 'postNotifications.user',
        select: 'profilePicture username',
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedUser);
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.user.id === req.params.id || req.body.isAdmin) {
        yield user_1.default.findByIdAndDelete(req.params.id);
        return res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: 'Account has been deleted' });
    }
    else {
        throw new index_1.BadRequestError('You can only delete your account');
    }
});
exports.deleteUser = deleteUser;
// export const followUser = async (req: Request, res: Response) => {
//   if (res.locals.user.id !== req.params.id) {
//     const user = await User.findById(req.params.id);
//     let currentUser = await User.findById(res.locals.user.id);
//     if (user) {
//       if (currentUser) {
//         // @ts-ignore
//         if (!user?.followers.includes(res.locals.user.id)) {
//           // @ts-ignore
//           await user.updateOne({ $push: { followers: res.locals.user.id } });
//           // @ts-ignore
//           currentUser = await User.findByIdAndUpdate(
//             currentUser._id,
//             {
//               // @ts-ignore
//               $push: { following: req.params.id },
//             },
//             {
//               new: true,
//               runValidators: true,
//             }
//           ).populate('following', 'username profilePicture');
//           return res.status(StatusCodes.OK).json(currentUser?.following);
//         } else {
//           throw new NotFoundError(`User with id ${req.params.id} not found`);
//         }
//       } else {
//         throw new NotFoundError(`User with id ${res.locals.user.id} not found`);
//       }
//     } else {
//       throw new BadRequestError('You already follow this user');
//     }
//   } else {
//     throw new BadRequestError('You cant follow yourself');
//   }
// };
// export const unfollowUser = async (req: Request, res: Response) => {
//   if (res.locals.user.id !== req.params.id) {
//     const user = await User.findById(req.params.id);
//     let currentUser = await User.findById(res.locals.user.id);
//     // @ts-ignore
//     if (user?.followers.includes(res.locals.user.id)) {
//       // @ts-ignore
//       await user.updateOne({ $pull: { followers: res.locals.user.id } });
//       // @ts-ignore
//       currentUser = await User.findByIdAndUpdate(
//         currentUser?._id,
//         {
//           // @ts-ignore
//           $pull: { following: req.params.id },
//         },
//         {
//           new: true,
//           runValidators: true,
//         }
//       ).populate('following', 'username profilePicture');
//       return res.status(StatusCodes.OK).json(currentUser?.following);
//     } else {
//       throw new BadRequestError('You dont follow this user');
//     }
//   } else {
//     throw new BadRequestError('You cant unfollow yourself');
//   }
// };
const getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.params.id).populate('friends', 'username profilePicture');
    if (!user) {
        throw new index_1.NotFoundError(`User with id ${req.params.id} doesnt exist`);
    }
    else {
        res.status(http_status_codes_1.StatusCodes.OK).json(user.friends);
    }
});
exports.getFriends = getFriends;
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    const username = new RegExp(search, 'i');
    const users = yield user_1.default.find({
        username,
    }).find({ _id: { $ne: res.locals.user.id } });
    res.status(http_status_codes_1.StatusCodes.OK).json(users);
});
exports.searchUsers = searchUsers;
const removeFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findByIdAndUpdate(res.locals.user.id, {
        $pull: {
            // @ts-ignore
            friends: req.params.id,
        },
    }, {
        new: true,
        runValidators: true,
    });
    yield user_1.default.findByIdAndUpdate(req.params.id, {
        $pull: {
            // @ts-ignore
            friends: res.locals.user.id,
        },
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(user);
});
exports.removeFriend = removeFriend;
