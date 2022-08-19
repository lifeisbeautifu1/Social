"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../controllers/user");
router.get('/find', user_1.searchUsers);
router.get('/me', user_1.getUserInfo);
router.get('/:id', user_1.getUser);
router.get('/friends/:id', user_1.getFriends);
router.patch('/:id', user_1.updateUser);
router.delete('/:id/friend', user_1.removeFriend);
router.delete('/:id', user_1.deleteUser);
exports.default = router;
