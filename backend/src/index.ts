import express from 'express';
import 'express-async-errors';
import 'colors';
import 'dotenv/config';

import connectDB from './db/connectDB';

import notFound from './middleware/notFound';
import errorHandler from './middleware/error';
import authMiddleware from './middleware/auth';

import auth from './routes/auth';
import user from './routes/users';
import post from './routes/posts';
import conversation from './routes/conversation';
import message from './routes/message';
import upload from './routes/upload';
import friendRequests from './routes/friendRequests';

const app = express();

// const __dirname = path.resolve(
//   path.dirname(decodeURI(new URL(import.meta.url).pathname))
// );

// app.use('/images', express.static(path.join(__dirname + '/public/images')));

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

app.use('/api/auth', auth);
app.use('/api/users', authMiddleware, user);
app.use('/api/posts', authMiddleware, post);
app.use('/api/conversations', authMiddleware, conversation);
app.use('/api/messages', authMiddleware, message);
app.use('/api/upload', authMiddleware, upload);
app.use('/api/friendRequests', authMiddleware, friendRequests);

app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Server runnnig on port ${PORT}`.bgGreen)
    );
  } catch (error) {
    console.log(`${error}`.red.bold);
    process.exit(1);
  }
};

start();
