import { isAuthenticated } from "@src/middleware/Auth";
import { Router } from "express";
import * as userController from "@src/controller/userController";

const userRouter = Router();

userRouter.get('/', userController.defaultRouter);
userRouter.get('/get-user-detail', isAuthenticated, userController.getUser);
userRouter.post('/newUser', isAuthenticated, userController.addNewUser);
userRouter.patch('/edit', isAuthenticated, userController.editUser);
userRouter.post('/daily-visit', isAuthenticated, userController.dailyVisit);
userRouter.get('/stats', isAuthenticated, userController.getStats);
userRouter.get('/profile-data', isAuthenticated, userController.getProfileData);

export default userRouter;