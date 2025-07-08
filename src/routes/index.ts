import { Router } from 'express';
import userRouter from './user';
import playListRouter from './playlist';
import musicRouter from './music';

const apiRouter = Router();

apiRouter.use('/user', userRouter)
apiRouter.use('/playlist', playListRouter)
apiRouter.use('/music', musicRouter)

apiRouter.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API Route' });
})

export default apiRouter;
