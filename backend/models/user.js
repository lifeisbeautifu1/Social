import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide username'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
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
      default: '',
    },
    from: {
      type: String,
      default: '',
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
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

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePasswords = async function (candidate) {
  const isMatch = await bcrypt.compare(candidate, this.password);
  return isMatch;
};

const User = mongoose.model('User', UserSchema);

export default User;
