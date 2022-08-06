import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide username'],
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please provide email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minLength: 8,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    coverPicture: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: 'City ...',
    },
    from: {
      type: String,
      default: 'From ...',
    },
    relationship: {
      type: Number,
      default: 1,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
