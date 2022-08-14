import mongoose from 'mongoose';


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
    messageNotifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MessageNotification',
      },
    ],
    postNotifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostNotification',
      },
    ],
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
    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FriendRequest',
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
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
