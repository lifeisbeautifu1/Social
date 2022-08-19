"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const friendRequests_1 = require("../controllers/friendRequests");
router.post('/', friendRequests_1.createRequest);
router.patch('/:id', friendRequests_1.closeRequest);
exports.default = router;
