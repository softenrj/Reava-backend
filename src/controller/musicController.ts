import Music from '@src/models/Music';
import express, { Request, Response } from 'express'

export const defaultRouter = (
    res: Response,
    req: Request
) => {
    res.status(200).json({ message: "Welcome to the Music Router" })
}

export const addNewMusic = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const fireBaseUserId = req.user?.uid;
        const { title, audioPath, videoPath, imagePath, duration } = req.body;
        if (!fireBaseUserId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!title && !audioPath && !duration) {
            res.status(400).json({ message: 'Invalid request' });
            return;
        }

        const Result = await Music.create({
            fireBaseUserId,
            title,
            audioPath,
            duration,
            videoPath,
            imagePath,
        })
        res.status(200).json(Result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const editMusic = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const fireBaseUserId = req.user?.uid;
        const musicId = req.params.musicId;
        const { title, audioPath, videoPath, imagePath, duration } = req.body;
        if (!fireBaseUserId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!musicId) {
            res.status(400).json({ message: 'Invalid request' });
            return;
        }

        const updateFields: any = {};
        if (title !== undefined) updateFields.title = title;
        if (audioPath !== undefined) updateFields.audioPath = audioPath;
        if (videoPath !== undefined) updateFields.videoPath = videoPath;
        if (imagePath !== undefined) updateFields.imagePath = imagePath;
        if (duration !== undefined) updateFields.duration = duration;

        const Result = await Music.updateOne({ _id: musicId }, {
            $set: updateFields
        }, { new: true })
        res.status(200).json(Result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteMusic = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const fireBaseUserId = req.user?.uid;
        const musicId = req.params.musicId;
        if (!fireBaseUserId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!musicId) {
            res.status(400).json({ message: 'Invalid request' });
            return;
        }
        const Result = await Music.deleteOne({ _id: musicId });
        res.status(200).json(Result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getMusic = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const fireBaseUserId = req.user?.uid;
        if (!fireBaseUserId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const Result = await Music.find({
            fireBaseUserId
        });
        res.status(200).json(Result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getMusicById = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const fireBaseUserId = req.user?.uid;
        const musicId = req.params.musicId;
        if (!fireBaseUserId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!musicId) {
            res.status(400).json({ message: 'Invalid request' });
            return;
        }
        const Result = await Music.find({ _id: musicId, fireBaseUserId });
        res.status(200).json(Result)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const likeMusic = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const fireBaseUserId = req.user?.uid;
        const musicId = req.params.musicId;
        if (!fireBaseUserId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!musicId) {
            res.status(400).json({ message: 'Invalid request' });
            return;
        }
        const updatedMusic = await Music.findByIdAndUpdate(
            musicId,
            { $set: { isLiked: true } },
            { new: true }
        );
        res.status(200).json(updatedMusic)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const unlikeMusic = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const fireBaseUserId = req.user?.uid;
        const musicId = req.params.musicId;
        if (!fireBaseUserId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!musicId) {
            res.status(400).json({ message: 'Invalid request' });
            return;
        }
        const updatedMusic = await Music.findByIdAndUpdate(
            musicId,
            { $set: { isLiked: false } },
            { new: true }
        );
        res.status(200).json(updatedMusic)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}