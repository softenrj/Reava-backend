import userRouter from './routes/user';
import playListRouter from './routes/playlist';
import musicRouter from './routes/music';

import { Application, Request, Response } from 'express';

const router = (app: Application): void => {
    app.use('/user', userRouter)
    app.use('/playlist', playListRouter)
    app.use('/music', musicRouter)

    app.use("/api", (req: Request, res: Response) => {
        res.status(200).json({ message: "Welcome to the API" });
    });
}

export default router
