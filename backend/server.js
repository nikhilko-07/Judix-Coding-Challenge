import express from 'express';
const app = express();
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/posts.routes.js"
import cors from "cors";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use(userRoutes);
app.use(postRoutes);


const PORT = process.env.PORT || 3000;

const db = async ()=>{
    try {
        await mongoose.connect("mongodb+srv://nikhil:nikhil@ourdb.dykydkn.mongodb.net/?retryWrites=true&w=majority&appName=ourDB");
        console.log("Database Connected");
    }catch (err){
        console.log(err);
    }
}

app.listen(PORT, () => {
    db();
    console.log(`Server started on port ${PORT}`);
})