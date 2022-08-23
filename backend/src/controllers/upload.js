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
exports.deleteImage = exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const http_status_codes_1 = require("http-status-codes");
const streamifier_1 = __importDefault(require("streamifier"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            var _a;
            const stream = cloudinary_1.v2.uploader.upload_stream((error, result) => {
                if (result)
                    resolve(result);
                else
                    reject(error);
            });
            streamifier_1.default.createReadStream((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.buffer).pipe(stream);
        });
    };
    const result = yield streamUpload(req);
    res.status(200).send(result);
});
exports.uploadImage = uploadImage;
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    cloudinary_1.v2.uploader.destroy(id, function (result) {
        console.log(result);
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Deleted' });
});
exports.deleteImage = deleteImage;
