import mongoose, { Document, Model, Schema } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: Number;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema = new Schema<Message>({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: Number,
  },
  verifyCodeExpiry: {
    type: Date,
    default: Date.now(),
  },
  messages: [messageSchema],
});


export const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export const MessageModel: Model<Message> =
  mongoose.models.Message || mongoose.model<Message>("Message", messageSchema);
