import express from 'express';
import 'express-async-errors';
import 'colors';
import 'dotenv/config';

import connectDB from './db/connectDB.js';

import notFound from './middleware/notFound.js';
import errorHandler from './middleware/error.js';

import auth from './routes/auth.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', auth);

app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`Server runnnig on port ${PORT}`.yellow.bold)
    );
  } catch (error) {
    console.log(`${error}`.red.bold);
    process.exit(1);
  }
};

start();
