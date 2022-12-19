"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageNotification_1 = require("../controllers/messageNotification");
const router = express_1.default.Router();
router.get('/', messageNotification_1.getNotifications);
router.delete('/:id', messageNotification_1.deleteNotifications);
exports.default = router;
