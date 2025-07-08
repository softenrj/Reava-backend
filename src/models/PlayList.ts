import mongoose, { Schema } from "mongoose";

interface IPlayHistory {
  fireBaseUserId: string;
  musicId: mongoose.Types.ObjectId;
  playedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PlayHistorySchema = new mongoose.Schema<IPlayHistory>({
  fireBaseUserId: { type: String, ref: 'User', required: true },
  musicId: { type: Schema.Types.ObjectId, ref: 'Music', required: true },
  playedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("PlayHistory", PlayHistorySchema);