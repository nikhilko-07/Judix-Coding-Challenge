import express from 'express';
const app = express();
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/posts.routes.js"
import storyRoutes from "./routes/story.routes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use(userRoutes);
app.use(postRoutes);
app.use(storyRoutes);


const PORT = 9000;

const db = async ()=>{
    try {
        await mongoose.connect("mongodb+srv://nikhil:nikhil@ourdb.dykydkn.mongodb.net/?appName=ourDB);
        console.log("Database Connected");
    }catch (err){
        console.log(err);
    }
}

app.listen(PORT, () => {
    db();
    console.log(`Server started on port ${PORT}`);
})
