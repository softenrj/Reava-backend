import Music from '@src/models/Music';
import PlayList from '@src/models/PlayList';
import express, { Request, Response } from 'express';
import UserStatsService from '@src/common/services/UserStatsService';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const defaultRouter = (
  res: Response,
  req: Request
) => {
  res.status(200).json({ message: "Welcome to the PlayList Router" })
}

let cached: any[] = []

export const getPlayListFromGemini = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fireBaseUserId = req.user?.uid;

    if (!fireBaseUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const list = await PlayList.aggregate([
      { $match: { fireBaseUserId } },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'musics',
          localField: 'musicId',
          foreignField: '_id',
          as: 'music'
        }
      },
      { $unwind: '$music' },
      {
        $project: {
          _id: '$music._id',
          title: '$music.title',
          played: '$music.played',
          likedByUser: '$music.isLiked'
        }
      }
    ]);

    if (list.length === 0) {
      res.status(404).json({ message: "No recent music found.", data: cached });
      return;
    }

    const formattedList = list.map((item, i) => (
      `${i + 1}. id: ${item._id}, ${item.title} (played: ${item.played}, liked: ${item.likedByUser ? 'Yes' : 'No'})`
    )).join('\n');

    const prompt = `Here are the Top 10 recently played songs:\n${formattedList}
Reorder them based on engagement potential.
Return ONLY a JSON array of IDs (e.g. ["id1", "id2", ...]). No extra text. Don't add any new songs.`;

    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
    });

    let output = result.choices[0]?.message?.content || '';

    let parsed: string[] = [];

    try {
      parsed = JSON.parse(output);
    } catch (err) {
      console.error("JSON parse failed:", err);
      res.status(500).json({ message: "Invalid model response format", data: cached });
      return;
    }

    const suggestedList: any[] = [];

    await Promise.all(parsed.map(async (id: string) => {
      let mId = id;
      if (mId.includes("id")) {
        mId = mId.replace("id:", "").trim();
      }

      try {
        const music = await Music.findById(mId);
        if (music) {
          suggestedList.push(music);
        }
      } catch (err) {
        console.warn(`Failed to fetch music with id: ${mId}`, err);
      }
    }));

    const uniqueList = Array.from(
      new Map(suggestedList.map(item => [item._id.toString(), item])).values()
    )

    cached = uniqueList;

    res.status(200).json({ message: "Success", data: uniqueList });

  } catch (err) {
    console.error('[getPlayListFromGemini] Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logPlay = async (
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
      res.status(400).json({ message: 'Invalid music id' });
      return;
    }

    await PlayList.create({
      fireBaseUserId,
      musicId,
    })

    await Music.findByIdAndUpdate(musicId, {
      $inc: {
        played: 1
      }
    })

    CleanerService();

    res.status(200).json({ message: 'Logged play event' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const CleanerService = async () => {
  console.log('Clean Service Call 😁')
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const latestSix = await PlayList.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .select('_id');

  const keepIds = latestSix.map(doc => doc._id);

  await PlayList.deleteMany({
    createdAt: { $lt: oneWeekAgo },
    _id: { $nin: keepIds }
  });

  console.log('clean service done ✔️')
}

export const getPlayList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fireBaseUserId = req.user?.uid;
    const { limit = 10, lastCreatedAt } = req.query;

    if (!fireBaseUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const query: any = { fireBaseUserId };

    if (lastCreatedAt) {
      const date = new Date(lastCreatedAt as string);
      if (!isNaN(date.getTime())) {
        query.createdAt = { $lt: date };
      }
    }

    const playList = await PlayList.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json(playList);
  } catch (err) {
    console.error('[getPlayList] Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const getTopPlayed = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fireBaseUserId = req.user?.uid;
    // const { limit = 10, lastCreatedAt } = req.query;
    if (!fireBaseUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const query: any = { fireBaseUserId };
    // if (lastCreatedAt) {
    //   const date = new Date(lastCreatedAt as string);
    //   if (!isNaN(date.getTime())) {
    //     query.createdAt = { $lt: date };
    //   }
    // }
    const playList = await Music.find(query).sort({
      played: 1
    })
    // .limit(Number(limit));
    res.status(200).json(playList);
  } catch (err) {
    console.error('[getTopPlayed] Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const getRecentPlayed = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fireBaseUserId = req.user?.uid;
    const { limit = 10, lastCreatedAt } = req.query;

    if (!fireBaseUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const query: any = { fireBaseUserId };

    if (lastCreatedAt) {
      const date = new Date(lastCreatedAt as string);
      if (!isNaN(date.getTime())) {
        query.createdAt = { $lt: date };
      }
    }

    const recentPlays = await PlayList.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("musicId");

    const result = [];
    const seen = new Set();

    for (const item of recentPlays) {
      const music = item.musicId;
      const id = music?._id?.toString();
      if (id && !seen.has(id)) {
        seen.add(id);
        result.push(music);
      }
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('[getRecentPlayed] Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getRecentPlayedFunction = async (fireBaseUserId: string): Promise<any> => {
  try {

    if (!fireBaseUserId) {
      console.error('Unauthorized')
      return [];
    }

    const query: any = { fireBaseUserId };


    const recentPlays = await PlayList.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(10))
      .populate("musicId");

    const result = [];
    const seen = new Set();

    for (const item of recentPlays) {
      const music = item.musicId;
      const id = music?._id?.toString();
      if (id && !seen.has(id)) {
        seen.add(id);
        result.push(music);
      }
    }

    return result;
  } catch (err) {
    console.error('[getRecentPlayed] Error:', err);
    return [];
  }
};


export const updateWatchTime = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fireBaseUserId = req.user?.uid;
    const musicId = req.params.musicId;


    if (!fireBaseUserId || !musicId) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const music = await Music.findById(musicId, { duration: 1 });

    await UserStatsService.userStatsUpdate(fireBaseUserId, music?.duration);
    res.status(200).json({ message: "Watch time updated" });
  } catch (err) {
    console.error("updateWatchTime error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getMyMusic = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fireBaseUserId = req.user?.uid;

    if (!fireBaseUserId) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }

    const allMusic = await Music.find({ fireBaseUserId });

    // Shuffle using Fisher-Yates algorithm 
    for (let i = allMusic.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allMusic[i], allMusic[j]] = [allMusic[j], allMusic[i]];
    }

    res.status(200).json(allMusic);
  } catch (err) {
    console.error('[getMyMusic] Error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
