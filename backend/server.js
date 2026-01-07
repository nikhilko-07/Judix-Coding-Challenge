import http from 'http';
import express from 'express';
import {Server}from "socket.io"
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


const PORT = process.env.PORT || 9000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001", // frontend url
        methods: ["GET", "POST"],
    },
});

const db = async ()=>{
    try {
        await mongoose.connect(process.env.MONOG_URI);
        console.log("Database Connected");
    }catch (err){
        console.log(err);
    }
}

io.on("connection", (socket) => {
    console.log("Client connected");

    //join room using userId
    socket.on("join", (userId)=>{
        socket.join(userId);
        console.log(`Joined user ID: ${userId}`);
    })

    //send message
    socket.on("sendMessage",(message, recieverId, senderId)=>{
        io.to(message.receiver).emit("receiveMessage",message);
        console.log(message, recieverId, senderId);
    });

    //disconnect
    socket.on("disconnect",()=>{
        console.log("Disconnected");
    })
})



server.listen(PORT, () => {
    db();
    console.log(`Server started on port ${PORT}`);
})