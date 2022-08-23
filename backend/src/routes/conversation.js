"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const conversation_1 = require("../controllers/conversation");
router.post('/:id', conversation_1.createConversation);
router.get('/', conversation_1.getConversations);
router.get('/:id', conversation_1.getConversation);
exports.default = router;
