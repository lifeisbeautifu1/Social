import express from 'express';
import 'express-async-errors';
import 'colors';
import 'dotenv/config';

import path from 'path';

import connectDB from './db/connectDB.js';

import notFound from './middleware/notFound.js';
import errorHandler from './middleware/error.js';
import authMiddleware from './middleware/auth.js';

import auth from './routes/auth.js';
import user from './routes/users.js';
import post from './routes/posts.js';
import conversation from './routes/conversation.js';
import message from './routes/message.js';
import upload from './routes/upload.js';

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
