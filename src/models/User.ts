import mongoose, { Schema } from "mongoose";

interface User {
  _id: mongoose.Types.ObjectId;
  fireBaseUserId: string;
  username: string;
  fullName: string;
  email: string;
  profile: string;
  cover: string;
}

const User = new mongoose.Schema<User>({
  fireBaseUserId: { type: String, required: true, unique: true },
  username: { type: String, required: false },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profile: { type: String , required: false},
  cover: { type: String , required: false},
}, {timestamps: true});

export default mongoose.model("User", User)