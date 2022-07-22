import mongoose from 'mongoose';

const connectDB = async () => {
  return mongoose.connect(process.env.MONGO_URI);
};

export default connectDB;
