import express from "express"
import {registeredUser, userCredits} from "../controllers/userController.js"
import{ loginUser} from "../controllers/userController.js"
import userAuth from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post('/register',registeredUser);
userRouter.post('/login',loginUser);
userRouter.get('/credits', userAuth ,userCredits);


export default userRouter
