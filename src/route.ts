import userRouter from './routes/user';
import playListRouter from './routes/playlist';
import musicRouter from './routes/music';

import { Application, Request, Response } from 'express';

const router = (app: Application): void => {
    app.use('/api/user', userRouter)
    app.use('/api/playlist', playListRouter)
    app.use('/api/music', musicRouter)

    app.use("/", (req: Request, res: Response) => {
        res.status(200).json({ message: "Welcome to the API" });
    });
}

export default router
