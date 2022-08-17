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
exports.deleteNotifications = exports.getNotifications = void 0;
const user_1 = __importDefault(require("../models/user"));
const messageNotification_1 = __importDefault(require("../models/messageNotification"));
const http_status_codes_1 = require("http-status-codes");
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_1.default.findById(res.locals.user.id).populate('messageNotifications', 'createdAt from to conversation');
    user = yield user_1.default.populate(user, {
        path: 'messageNotifications.from',
        select: 'profilePicture username',
    });
    res.status(http_status_codes_1.StatusCodes.OK).json(user.messageNotifications);
});
exports.getNotifications = getNotifications;
const deleteNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const notifications = yield messageNotification_1.default.find({ from: id });
    let notificationsId = notifications.map((n) => n._id);
    yield user_1.default.findByIdAndUpdate(res.locals.user.id, {
        $pull: {
            messageNotifications: {
                // @ts-ignore
                $in: notificationsId,
            },
        },
    });
    yield messageNotification_1.default.deleteMany({
        from: id,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'OK' });
});
exports.deleteNotifications = deleteNotifications;
