"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_1 = require("../controllers/post");
router.post('/', post_1.createPost);
router.get('/timeline', post_1.getPosts);
router.get('/:id', post_1.getPost);
router.get('/all/:userId', post_1.getUsersPosts);
router.patch('/:id', post_1.updatePost);
router.delete('/:id', post_1.deletePost);
router.post('/:id/like', post_1.likePost);
router.post('/:id/comment', post_1.addComment);
router.delete('/:postId/comment/:commentId', post_1.deleteComment);
exports.default = router;
