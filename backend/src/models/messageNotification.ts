import mongoose from 'mongoose';

const MessageNotificationSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const MessageNotification = mongoose.model(
  'MessageNotification',
  MessageNotificationSchema
);

export default MessageNotification;
