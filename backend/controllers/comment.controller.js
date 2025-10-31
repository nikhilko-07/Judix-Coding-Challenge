import Post from "../models/post.model";
import User from "../models/user.model";


export const getComments = async (req, res)=>{
    try {
        const {post_id} = req.body;
        if(!post_id){
            return res.status(400).send({message:"No post id provided"});
        }
        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(400).send({message:"Post not found"});
        }
        const comments = await Comment.find({postId:post_id});
        // Add populate function
        if(!comments){
            return res.status(400).send({message:"Comment not found"});
        }
        return res.status(200).json({comments});
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Something went wrong..."});
    }
}

export const createComment = async (req, res)=>{
    try {
        const {post_id, token, body} = req.body;
        if(!post_id || !token || !body){
            return res.status(400).send({message:"Invalid credentials"});
        }
        const post = await Post.findOne({_id: post_id});
        if(!post){
            return res.status(400).send({message:"Post not found"});
        }
        const user = await User.findOne({token});
        if(!user){
            return res.status(400).send({message:"Invalid credentials"});
        }
        const comment = new Comment({
            postId: post_id,
            body,
            userId:user._id
        })
        await comment.save();
        return res.status(200).json({message:"Comment successfully created"});
    }catch (err){
        console.log(err);
        return res.status(400).send({message:"Something went wrong..."});
    }
}

export const deleteComment = async (req, res)=>{
    try {
        const {token, comment_id} = req.body;
        if(!token || !comment_id){
            return res.status(400).send({message:"Invalid credentials"});
        }
        const user = await User.findOne({token});
        if(!user){
            return res.status(400).send({message:"user not found"});
        }
        const comment = await Comment.findOne({_id:comment_id});
        if(!comment){
            return res.status(400).send({message:"Comment not found"});
        }
        if(comment.userId.toString() !== user._id.toString()){
            return res.status(400).send({message:"Authentication failed"});
        }
        await Comment.deleteOne({_id:comment_id});
        return res.status(200).send({message:"Comment successfully deleted"});
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Something went wrong..."});
    }
}

export const likePost = async (req, res)=>{
    try {
        const {post_id} = req.body;
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Something went wrong..."});
    }
}