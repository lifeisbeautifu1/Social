"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
const message_1 = require("../controllers/message");
router.post('/', message_1.createMessage);
router.get('/:conversationId', message_1.getMessages);
exports.default = router;
