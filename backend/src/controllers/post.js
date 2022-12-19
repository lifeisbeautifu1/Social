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
exports.deleteComment = exports.addComment = exports.getUsersPosts = exports.getPosts = exports.getPost = exports.likePost = exports.deletePost = exports.createPost = exports.updatePost = void 0;
const user_1 = __importDefault(require("../models/user"));
const post_1 = __importDefault(require("../models/post"));
const comment_1 = __importDefault(require("../models/comment"));
const postNotification_1 = __importDefault(require("../models/postNotification"));
const errors_1 = require("../errors");
const http_status_codes_1 = require("http-status-codes");
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let post = yield post_1.default.findById(req.params.id);
    if (!post) {
        throw new errors_1.NotFoundError(`Post with id ${req.params.id} doesnt exist`);
    }
    else {
        if (post.author == res.locals.user.id) {
            post = yield post.updateOne(req.body, {
                new: true,
                runValidators: true,
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json(post);
        }
        else {
            throw new errors_1.BadRequestError('You can only update your posts');
        }
    }
});
exports.updatePost = updatePost;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_1.default.create(req.body);
    const fullPost = yield user_1.default.populate(post, {
        path: 'author',
        select: 'username profilePicture',
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(fullPost);
});
exports.createPost = createPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_1.default.findById(req.params.id);
    if (post) {
        if (post.author == res.locals.user.id) {
            yield comment_1.default.deleteMany({ postId: post._id });
            yield post.deleteOne();
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: 'The post has been deleted' });
        }
        else {
            throw new errors_1.BadRequestError('You can only delete your posts');
        }
    }
    else {
        throw new errors_1.NotFoundError(`Post with id ${req.params.id} doesnt exist`);
    }
});
exports.deletePost = deletePost;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let post = yield post_1.default.findById(req.params.id);
    if (post) {
        // @ts-ignore
        if (post.likes.includes(res.locals.user.id)) {
            // @ts-ignore
            post.likes = post.likes.filter((id) => id != res.locals.user.id);
        }
        else {
            post.likes.push(res.locals.user.id);
            if ((post === null || post === void 0 ? void 0 : post.author) != res.locals.user.id) {
                // @ts-ignore
                const notification = yield postNotification_1.default.create({
                    user: res.locals.user.id,
                    post: post === null || post === void 0 ? void 0 : post._id,
                    type: 'Like',
                });
                yield user_1.default.findByIdAndUpdate(post === null || post === void 0 ? void 0 : post.author, {
                    $push: {
                        // @ts-ignore
                        postNotifications: notification === null || notification === void 0 ? void 0 : notification._id,
                    },
                });
            }
        }
        yield post.save();
        post = yield post_1.default.findById(req.params.id).populate('author', 'username profilePicture');
        res.status(http_status_codes_1.StatusCodes.OK).json(post);
    }
    else {
        throw new errors_1.NotFoundError(`Post with id ${req.params.id} not found`);
    }
});
exports.likePost = likePost;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const post = yield post_1.default.findById(req.params.id)
        .populate('author', 'username profilePicture')
        .populate('comments', 'author body postId createdAt');
    const fullPost = yield user_1.default.populate(post, {
        path: 'comments.author',
        select: 'username profilePicture desc',
    });
    const notifications = yield postNotification_1.default.find({
        post: fullPost === null || fullPost === void 0 ? void 0 : fullPost._id,
    });
    const notificationId = notifications.map((n) => n._id);
    yield user_1.default.findByIdAndUpdate((_a = post === null || post === void 0 ? void 0 : post.author) === null || _a === void 0 ? void 0 : _a._id, {
        $pull: {
            postNotifications: {
                // @ts-ignore
                $in: notificationId,
            },
        },
    });
    yield postNotification_1.default.deleteMany({ post: post === null || post === void 0 ? void 0 : post._id });
    res.status(http_status_codes_1.StatusCodes.OK).json(fullPost);
});
exports.getPost = getPost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const currentUser = yield user_1.default.findById(req.query.userId);
    const userPosts = yield post_1.default.find({ author: req.query.userId }).populate('author', 'username profilePicture');
    const friendPosts = yield post_1.default.find({
        author: {
            $in: currentUser === null || currentUser === void 0 ? void 0 : currentUser.friends,
        },
    }).populate('author', 'username profilePicture');
    // @ts-ignore
    let allPosts = userPosts.concat(...friendPosts).sort((p1, p2) => {
        return (
        // @ts-ignore
        new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime());
    });
    const numberOfPages = Math.ceil(allPosts.length / limit);
    allPosts = allPosts.slice(skip).slice(0, limit);
    res.status(http_status_codes_1.StatusCodes.OK).json({
        posts: allPosts,
        numberOfPages,
    });
});
exports.getPosts = getPosts;
const getUsersPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_1.default.find({ author: req.params.userId })
        .populate('author', 'username profilePicture')
        .sort({
        createdAt: -1,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(posts);
});
exports.getUsersPosts = getUsersPosts;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const { id } = req.params;
    const { body } = req.body;
    const comment = yield comment_1.default.create({
        postId: id,
        author: res.locals.user.id,
        body,
    });
    const post = yield post_1.default.findByIdAndUpdate(id, {
        $push: {
            comments: comment._id,
        },
    }, {
        new: true,
        runValidators: true,
    })
        .populate('author', 'username profilePicture desc')
        .populate('comments', 'author body postId createdAt');
    const updatedPost = yield user_1.default.populate(post, {
        path: 'comments.author',
        select: 'username profilePicture desc',
    });
    if (((_b = post === null || post === void 0 ? void 0 : post.author) === null || _b === void 0 ? void 0 : _b._id) != res.locals.user.id) {
        const notification = yield postNotification_1.default.create({
            user: res.locals.user.id,
            post: post === null || post === void 0 ? void 0 : post._id,
            type: 'Comment',
        });
        yield user_1.default.findByIdAndUpdate((_c = post === null || post === void 0 ? void 0 : post.author) === null || _c === void 0 ? void 0 : _c._id, {
            $push: {
                // @ts-ignore
                postNotifications: notification === null || notification === void 0 ? void 0 : notification._id,
            },
        });
    }
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedPost);
});
exports.addComment = addComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, commentId } = req.params;
    yield comment_1.default.findByIdAndDelete(commentId);
    const post = yield post_1.default.findByIdAndUpdate(postId, {
        $pull: {
            comments: commentId,
        },
    }, {
        new: true,
        runValidators: true,
    })
        .populate('author', 'username profilePicture')
        .populate('comments', 'author body postId createdAt');
    const updatedPost = yield user_1.default.populate(post, {
        path: 'comments.author',
        select: 'username profilePicture',
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(updatedPost);
});
exports.deleteComment = deleteComment;
