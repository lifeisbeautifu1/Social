import mongoose from 'mongoose';

const PostNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const PostNotification = mongoose.model(
  'PostNotification',
  PostNotificationSchema
);

export default PostNotification;
