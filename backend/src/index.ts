import express, { Request, Response } from 'express';
import 'express-async-errors';
import 'colors';
import 'dotenv/config';
import { Server } from 'socket.io';

import connectDB from './db/connectDB';

import notFound from './middleware/notFound';
import errorHandler from './middleware/error';
import authMiddleware from './middleware/auth';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import auth from './routes/auth';
import user from './routes/users';
import post from './routes/posts';
import conversation from './routes/conversation';
import message from './routes/message';
import upload from './routes/upload';
import friendRequests from './routes/friendRequests';
import messageNotifications from './routes/messageNotification';

// Chats
import { addUser, users, removeUser, getUser } from './config/users';

const app = express();

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
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.enable('trust proxy');
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
  cors({
    origin: 'https://project-social.netlify.app',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/', (req: Request, res: Response) =>
  res.status(200).send('Hello world!')
);

app.use('/api/auth', auth);
app.use('/api/users', authMiddleware, user);
app.use('/api/posts', authMiddleware, post);
app.use('/api/conversations', authMiddleware, conversation);
app.use('/api/messages', authMiddleware, message);
app.use('/api/upload', authMiddleware, upload);
app.use('/api/friendRequests', authMiddleware, friendRequests);
app.use('/api/messageNotifications', authMiddleware, messageNotifications);

app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () =>
      console.log(`Server runnnig on port ${PORT}`.green.bold)
    );
    const io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    io.on('connection', (socket) => {
      console.log('User connected');

      socket.on('addUser', (userId) => {
        addUser(userId, socket.id);
        io.emit('getUsers', users);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
      });

      socket.on('sendMessage', (receiverId) => {
        // console.log(users, receiverId);
        const receiver = getUser(receiverId);
        // console.log('yoo bro you got message wake up', receiver);
        if (receiver) {
          socket.to(receiver.socketId).emit('getMessage');
        }
      });

      socket.on('typing', (receiverId) => {
        // console.log('start typing');
        const receiver = getUser(receiverId);
        if (receiver) {
          socket.to(receiver.socketId).emit('typing');
        }
      });

      socket.on('stopTyping', (receiverId) => {
        // console.log('stop typing');
        const receiver = getUser(receiverId);
        if (receiver) {
          socket.to(receiver.socketId).emit('stopTyping');
        }
      });
      socket.on('sendRequest', (receiverId) => {
        const receiver = getUser(receiverId);
        if (receiver) {
          socket.to(receiver.socketId).emit('getRequest');
        }
      });
    });
  } catch (error) {
    console.log(`${error}`.red.bold);
    process.exit(1);
  }
};

start();
