import { Router } from "express";
import * as playListController from '@src/controller/playListController';
import { isAuthenticated } from "@src/middleware/Auth";

const playList = Router();

playList.get('/', playListController.defaultRouter);
playList.post('/play/:musicId', isAuthenticated, playListController.logPlay);
playList.get('/playlist', isAuthenticated, playListController.getPlayList);
playList.get('/top-played', isAuthenticated, playListController.getTopPlayed);
playList.get('/recently-played', isAuthenticated, playListController.getRecentPlayed);
playList.get('/my-music', isAuthenticated, playListController.getMyMusic);
playList.get('/ai-suggession', isAuthenticated, playListController.getPlayListFromGemini);
playList.post('/update-watchtime/:musicId', isAuthenticated, playListController.updateWatchTime);

export default playList;