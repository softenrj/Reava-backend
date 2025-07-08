import { Router } from "express";
import * as musicController from '@src/controller/musicController'
import { isAuthenticated } from "@src/middleware/Auth";

const musicRouter = Router();

musicRouter.get('/', musicController.defaultRouter);
musicRouter.post('/newMusic', isAuthenticated, musicController.addNewMusic);
musicRouter.patch('/edit/:musicId', isAuthenticated, musicController.editMusic);
musicRouter.get('/my-music', isAuthenticated, musicController.getMusic);
musicRouter.get('/:musicId', isAuthenticated, musicController.getMusicById);
musicRouter.post('/like/:musicId', isAuthenticated, musicController.likeMusic);
musicRouter.post('/unlike/:musicId', isAuthenticated, musicController.unlikeMusic);
musicRouter.delete('/delete/:musicId', isAuthenticated, musicController.deleteMusic);

export default musicRouter;