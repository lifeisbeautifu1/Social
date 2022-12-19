"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../controllers/auth");
router.post('/register', auth_1.register);
router.post('/login', auth_1.login);
router.get('/logout', auth_1.logout);
router.post('/verify', auth_1.verifyAccount);
router.post('/reset/password', auth_1.resetPassword);
router.patch('/update/password', auth_1.updatePassword);
exports.default = router;
