import mongoose, { Schema } from "mongoose";

interface Rank {
  title: string;
  description: string;
  level: number; 
  minimumWatchTime: number;  
  nextRank?: mongoose.Types.ObjectId;
}

const RankSchema = new Schema<Rank>({
  title: { type: String, required: true, unique: true },
  level: { type: Number, required: true, unique: true },
  description: { type: String, required: true },
  minimumWatchTime: { type: Number, required: true },
  nextRank: { type: Schema.Types.ObjectId, ref: "Rank", default: null },
});

export default mongoose.model("Rank", RankSchema);
