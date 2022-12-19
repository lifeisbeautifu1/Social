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
const express_1 = __importDefault(require("express"));
require("express-async-errors");
require("colors");
require("dotenv/config");
const socket_io_1 = require("socket.io");
const connectDB_1 = __importDefault(require("./db/connectDB"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const error_1 = __importDefault(require("./middleware/error"));
const auth_1 = __importDefault(require("./middleware/auth"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_2 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const posts_1 = __importDefault(require("./routes/posts"));
const conversation_1 = __importDefault(require("./routes/conversation"));
const message_1 = __importDefault(require("./routes/message"));
const upload_1 = __importDefault(require("./routes/upload"));
const friendRequests_1 = __importDefault(require("./routes/friendRequests"));
const messageNotification_1 = __importDefault(require("./routes/messageNotification"));
// Chats
const users_2 = require("./config/users");
const app = (0, express_1.default)();
// const __dirname = path.resolve(
//   path.dirname(decodeURI(new URL(import.meta.url).pathname))
// );
// app.use('/images', express.static(path.join(__dirname + '/public/images')));
const corsOptions = {
    origin: true,
    credentials: true,
};
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.enable('trust proxy');
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'https://project-social.netlify.app',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// File uploading part
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/images');
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });
// const upload = multer({ storage });
// app.post('/api/upload', upload.single('file'), (req, res) => {
//   try {
//     res.status(200).json({ message: 'File uploaded successfully' });
//   } catch (error) {
//     console.log(error);
//   }
// });
// File uploading part ended
app.get('/', (req, res) => res.status(200).send('Hello world!'));
app.use('/api/auth', auth_2.default);
app.use('/api/users', auth_1.default, users_1.default);
app.use('/api/posts', auth_1.default, posts_1.default);
app.use('/api/conversations', auth_1.default, conversation_1.default);
app.use('/api/messages', auth_1.default, message_1.default);
app.use('/api/upload', auth_1.default, upload_1.default);
app.use('/api/friendRequests', auth_1.default, friendRequests_1.default);
app.use('/api/messageNotifications', auth_1.default, messageNotification_1.default);
app.use(error_1.default);
app.use(notFound_1.default);
const PORT = process.env.PORT || 5000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDB_1.default)();
        const server = app.listen(PORT, () => console.log(`Server runnnig on port ${PORT}`.green.bold));
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: '*',
            },
        });
        io.on('connection', (socket) => {
            console.log('User connected');
            socket.on('addUser', (userId) => {
                (0, users_2.addUser)(userId, socket.id);
                io.emit('getUsers', users_2.users);
            });
            socket.on('disconnect', () => {
                console.log('User disconnected');
                (0, users_2.removeUser)(socket.id);
                io.emit('getUsers', users_2.users);
            });
            socket.on('sendMessage', (receiverId) => {
                // console.log(users, receiverId);
                const receiver = (0, users_2.getUser)(receiverId);
                // console.log('yoo bro you got message wake up', receiver);
                if (receiver) {
                    socket.to(receiver.socketId).emit('getMessage');
                }
            });
            socket.on('typing', (receiverId) => {
                // console.log('start typing');
                const receiver = (0, users_2.getUser)(receiverId);
                if (receiver) {
                    socket.to(receiver.socketId).emit('typing');
                }
            });
            socket.on('stopTyping', (receiverId) => {
                // console.log('stop typing');
                const receiver = (0, users_2.getUser)(receiverId);
                if (receiver) {
                    socket.to(receiver.socketId).emit('stopTyping');
                }
            });
            socket.on('sendRequest', (receiverId) => {
                const receiver = (0, users_2.getUser)(receiverId);
                if (receiver) {
                    socket.to(receiver.socketId).emit('getRequest');
                }
            });
        });
    }
    catch (error) {
        console.log(`${error}`.red.bold);
        process.exit(1);
    }
});
start();
