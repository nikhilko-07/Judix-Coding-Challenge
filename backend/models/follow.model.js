import mongoose from "mongoose";


const followSchema = new mongoose.Schema({
    followerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    followingId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Follow = mongoose.model("Follow", followSchema);
export default Follow;