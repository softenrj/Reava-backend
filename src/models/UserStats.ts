import mongoose, { Schema } from "mongoose";

interface Stats {
    fireBaseUserId: string;
    watchTime: number;
    totalMusic: number;
    totalLiked: number;
    Rank: mongoose.Types.ObjectId;
    nextRank: mongoose.Types.ObjectId | null;
    nextRankProgress: number;
    streak: number;
    lastVisited: Date;
}

const statsSchema = new mongoose.Schema<Stats>({
    fireBaseUserId: { type: String, required: true },
    watchTime: { type: Number, default: 0 },
    totalMusic: { type: Number, default: 0 },
    totalLiked: { type: Number, default: 0 },
    Rank: { type: Schema.Types.ObjectId, required: true, ref: 'Rank' },
    nextRank: { type: Schema.Types.ObjectId, required: true },
    nextRankProgress: { type: Number, default: 0 },
    streak: { type: Number, default: 1 },
    lastVisited: { type: Date, required: true, default: Date.now },
})

export default mongoose.model('userStats', statsSchema);