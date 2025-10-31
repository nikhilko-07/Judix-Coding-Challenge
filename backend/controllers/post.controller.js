import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import Profile from "../models/profile.model.js";


export const createPost = async (req, res) => {
    try {
        const { name } = req.body;
        const user = req.user;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const images = req.files.map(file => ({
            path: file.path,
            filename: file.filename,
        }));

        const post = new Post({
            name,
            userId: user._id,
            images,
        });

        const profile = await Profile.findOne({userId:user._id});
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        await post.save();
        await Profile.updateOne({ userId: user._id }, { $push: { ownPosts: post._id } });
        return res.status(201).json({ message: "Post successfully created" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong..." });
    }
};


export const getPost = async (req, res)=>{
    try {
        const getPost = await Post.find();
        if(!getPost || getPost.lenght === 0){
            return res.status(404).send({message:"No post found"});
        }
        return res.status(200).send({getPost});
    }catch (err){
        console.log(err);
        return res.status(400).send({message:"Something went wrong..."});
    }
}

export const getRand = async (req, res) => {
    try {
        // Body se previouslySeenIds nikal rahe hain (agar nahi hai to empty array)
        const { previouslySeenIds = [] } = req.body;

        const pipeline = [];

        // Agar kuch IDs already seen hain, to unhe exclude kar rahe hain
        if (previouslySeenIds.length > 0) {
            pipeline.push({
                $match: {
                    _id: {
                        $nin: previouslySeenIds.map(id => new mongoose.Types.ObjectId(id))
                    },
                },
            });
        }

        // Random 5 posts nikal rahe hain
        pipeline.push({ $sample: { size: 5 } });

        // MongoDB aggregation chala rahe hain
        const posts = await Post.aggregate(pipeline);

        // 👉 Naye fetched posts ke IDs purane array me hi push kar diye
        posts.forEach(p => previouslySeenIds.push(p._id.toString()));

        // Ab updated same array ko response me bhej rahe hain
        return res.status(200).json({
            posts,
            nextPreviouslySeenIds: previouslySeenIds, // updated array
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong..." });
    }
};


export const deletePost = async (req, res)=>{
    try {
        const {token, post_id} = req.body;
        if(!token || !post_id){
            return res.status(400).send({message:"Invalid Credentials"});
        }
        const user = await User.findOne({token});
        if(!user){
            return res.status(400).send({message:"User does not exist"});
        }
        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(400).send({message:"Post does not exist"});
        }
        if(user._id.toString() !== post.userId.toString()){
            return res.status(400).send({message:"Invalid Credentials"});
        }
        await Post.deleteOne({_id:post_id});
        return res.status(201).send({message:"Post successfully deleted"});
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Something went wrong..."});
    }
}


export const incrementLikes = async (req, res)=>{
    try {
        const {token, post_id} = req.body;
        if(!token || !post_id){
            return res.status(400).send({message:"Invalid Credentials"});
        }
        const user = await User.findOne({token});
        if(!user){
            return res.status(400).send({message:"User does not exist"});
        }
        const post = Post.findOne({_id:post_id});
        if(!post){
            return res.status(400).send({message:"Post does not exist"});
        }
        await Post.findByIdAndUpdate(postId, {$addToSet: { likes: userId }},{ new: true });
        return res.status(201).send({message:"Post successfully deleted"});
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Something went wrong..."});
    }
}
export const decrementLike= async (req, res)=>{
    try {
        const {token, post_id} = req.body;
        if(!token || !post_id){
            return res.status(400).send({message:"Invalid Credentials"});
        }
        const user = await User.findOne({token});
        if(!user){
            return res.status(400).send({message:"User does not exist"});
        }
        const post = await Post.findOne({_id: post_id});
        if(!post){
            return res.status(400).send({message:"Post does not exist"});
        }
        if(!post.likes.includes(userId)){
            return res.status(400).send({message:"User hasn't like this post"});
        }
        const updatePost = await Post.findByIdAndUpdate(
            post_id,
            { $pull: { likes: user._id } },
            { new: true }
        );

        return res.status(200).send({
            message: "Like successfully removed",
            post: updatePost
        });

    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Something went wrong..."});
    }
}

export const sharePost = async (req, res)=>{
    try {
        const { post_id } = req.body;
        if(!post_id){
            return res.status(400).send({message:"Invalid Credentials"});
        }
        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(400).send({message:"Post does not exist"});
        }
        return res.status(201).json(`http://localhost:3000/${post_id}`);
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Something went wrong..."});
    }
}
            