import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    name:{
        type:String,
        required:true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    createdAt:{
        type:Date,
        default:Date.now
    },
    images:[{
        path:{
            type:String,
            required:true
        },
        filename:{
            type:String,
            required:true
        }
    }],
})

const Post = mongoose.model("Post", postSchema);
export default Post;