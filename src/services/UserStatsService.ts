import Rank from "@src/models/Rank"
import UserStats from "@src/models/UserStats"
import chalk from "chalk"

const userStatsProvide = async (fireBaseUserId: string) => {
    try {
        const rank = await Rank.findOne({
            level: 1,
            minimumWatchTime: 0
        })

        await UserStats.create({
            fireBaseUserId,
            Rank: rank?._id,
            nextRank: rank?.nextRank
        })
        console.log(chalk.magentaBright.bold(`user with userId: ${fireBaseUserId} 's Stats has been created successfully`))
    } catch (err) {
        console.error(err)
    }
}

const userStatsUpdate = async (fireBaseUserId: string, watchTime: number = 0) => {
    try {
        console.log(chalk.magentaBright.bold(`State Service Start..`))
        const watchTimeInSeconds = Math.floor(watchTime / 1000);

        const userStats = await UserStats.findOne({
            fireBaseUserId
        })

        if (!userStats) {
            await userStatsProvide(fireBaseUserId)
            return;
        }

        const totalWatchTime = userStats.watchTime + watchTimeInSeconds;

        const rank = await Rank.findOne({
            minimumWatchTime: { $lte: totalWatchTime }
        }).sort({ minimumWatchTime: -1 })


        if (!rank || !rank.nextRank) {
            console.log(chalk.gray.underline.bold(`user with userId: ${fireBaseUserId} has reached the highest rank with wathTime: ${watchTime}`))
            return;
        }
        
        userStats.watchTime += watchTimeInSeconds;

        if (rank) {
            userStats.Rank = rank._id;
            userStats.nextRank = rank.nextRank;

            if (rank.nextRank) {
                const nextRank = await Rank.findById(rank.nextRank);

                if (nextRank) {
                    const progress = ((watchTimeInSeconds - rank.minimumWatchTime) /
                        (nextRank.minimumWatchTime - rank.minimumWatchTime)) * 100;

                    userStats.nextRankProgress = Math.min(Math.max(progress, 0), 100);
                } else {
                    userStats.nextRankProgress = 100;
                }
            } else {
                userStats.nextRankProgress = 100;
            }
        }

        await userStats.save()
        console.log(chalk.green.bold(`user with userId: ${fireBaseUserId} 's Stats has been updated successfully`))
    } catch (err) {
        console.error(err)
    }
}

export default { userStatsProvide, userStatsUpdate }