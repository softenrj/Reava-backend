import User from "@src/models/User";
import UserStats from "@src/models/UserStats";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import UserStatsService from "@src/services/UserStatsService";
import Music from "@src/models/Music";
import playList from "@src/routes/playlist";
import PlayList from "@src/models/PlayList";
import chalk from "chalk";
import { getRecentPlayedFunction } from "./playListController";

export const defaultRouter = (
    res: Response,
    req: Request
) => {
    res.status(200).json({ message: "Welcome to the user Router" })
}

export const getUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const fireBaseUserId = req.user?.uid;
        console.log(chalk.gray(req.user))

        if (!fireBaseUserId) {
            res.status(401).json({ message: "Unauthorized" })
            return;
        }
        const Result = await User.findOne({
            fireBaseUserId
        })
        if (!Result) {
            res.status(404).json({ message: "User not found" })
            return;
        }
        res.status(200).json(Result);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const addNewUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { fullName } = req.body;
        const firebaseUser = req.user;
        if (!firebaseUser) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { uid, email } = firebaseUser;
        if (!fullName) {
            res.status(400).json({ message: "Please fill in all fields" });
            return;
        }
        const user = await User.create({
            fireBaseUserId: uid,
            fullName,
            email
        })
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const editUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const fireBaseUserId = req.user?.uid;
        const { fullName, username, profile, cover } = req.body;

        if (!fireBaseUserId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const updateFields: any = {};

        if (fullName !== undefined) { updateFields.fullName = fullName }
        if (username !== undefined) { updateFields.username = username }
        if (profile !== undefined) { updateFields.profile = profile }
        if (cover !== undefined) { updateFields.cover = cover }

        const Result = await User.findOneAndUpdate({ fireBaseUserId }, {
            $set: updateFields
        }, { new: true })
        res.status(200).json(Result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const dailyVisit = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const fireBaseUserId = req.user?.uid;
        const today = new Date();
        const yesterDay = new Date();
        yesterDay.setDate(yesterDay.getDate() - 1);

        const userStats = await UserStats.findOne({ fireBaseUserId }, {
            streak: 1,
            lastVisited: 1
        })

        if (!userStats) {
            await UserStatsService.userStatsProvide(fireBaseUserId as any)
            res.status(200).json({ message: "User stats Initialise" });
            return;
        }

        const isSameDay = userStats?.lastVisited.toDateString() === today.toDateString();
        const isYesterday = userStats?.lastVisited.toDateString() === yesterDay.toDateString();

        if (isSameDay) {
            res.status(200).json({ message: "You have already visited today" });
            return;
        } else if (isYesterday) {
            userStats.streak++;
            userStats.lastVisited = today;
            await userStats.save();
        } else {
            userStats.streak = 1;
            userStats.lastVisited = today;
            await userStats.save();
        }
        res.status(200).json({ message: "User stats updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const getStats = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const fireBaseUserId = req.user?.uid;
        if (!fireBaseUserId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const userStats = await UserStats.findOne({ fireBaseUserId })
        res.status(200).json(userStats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getProfileData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fireBaseUserId = req.user?.uid;
    if (!fireBaseUserId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const [user, userStats, musicAgg, rPlay] = await Promise.all([
      User.findOne({ fireBaseUserId }),
      UserStats.findOne({ fireBaseUserId }).populate(
        "Rank",
        "title description"
      ),
      Music.aggregate([
        { $match: { fireBaseUserId } },
        {
          $facet: {
            totalMusic: [{ $count: "count" }],
            totalLiked: [
              { $match: { isLiked: true } },
              { $count: "count" }
            ]
          }
        },
        {
          $project: {
            totalMusic: { $arrayElemAt: ["$totalMusic.count", 0] },
            totalLiked: { $arrayElemAt: ["$totalLiked.count", 0] }
          }
        }
      ]),
      getRecentPlayedFunction(fireBaseUserId)
    ]);

    const music = musicAgg[0] || { totalMusic: 0, totalLiked: 0 };

    res.status(200).json({ user, userStats, music, rPlay });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
