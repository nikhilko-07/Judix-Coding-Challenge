import Message from "../models/message.model.js";

export const sendMessage = async (req, res)=>{
    try{
        const {receiverId, content} = req.body;
        const senderId = req.user._id;
        const message = await Message.create({
            sender: senderId,
            content: content,
            receiver: receiverId,
        })
        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "name profilePicture")
            .populate("receiver", "name profilePicture");

        res.status(201).json(populatedMessage);
    }catch(err){
        console.log(err);
    }
}