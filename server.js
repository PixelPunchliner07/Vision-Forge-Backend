import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 3000
const app = express();

app.use(cors());
app.use(express.json());
await connectDB();

app.use('/api/user',userRouter)
app.use('/api/image',imageRouter)

app.get("/",function(req,res){
    res.send("Hello");
})

app.listen(PORT,function(){
    console.log("Server is running on port "+PORT);
})