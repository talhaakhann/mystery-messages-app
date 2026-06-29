import mongoose, { Document, Model, Schema,Types } from "mongoose";

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

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema = new Schema<User>({
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
  messages: [MessageSchema],
});


export interface Message {
  _id: Types.ObjectId;
  content: string;
  createdAt: Date;
}

export const UserModel: Model<User> =
  mongoose.models.User || mongoose.model<User>("User", UserSchema)

export const MessageModel: Model<Message> =

  mongoose.models.Message || mongoose.model<Message>("Message", MessageSchema);





