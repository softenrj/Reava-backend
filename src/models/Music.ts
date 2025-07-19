import mongoose, { Schema } from "mongoose";

interface IMusic {
    fireBaseUserId: string;
    title: string;
    videoPath: string;
    duration: number;
    audioPath: string;
    imagePath: string;
    isLiked: boolean;
    played: number;
    lyricsPath: string;
}

const Music = new mongoose.Schema<IMusic>({
    fireBaseUserId: { type: String , ref: 'User' },
    title: { type: String, required: true },
    duration: { type: Number },
    videoPath: { type: String, required: false },
    audioPath: { type: String, required: true },
    imagePath: { type: String, required: false },
    isLiked: { type: Boolean, default: false },
    played: { type: Number, default: 0 },
})

export default mongoose.model("Music", Music)