import mongoose from "mongoose";


const profileSchema = new mongoose.Schema( {
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    bio:{
        type:String,
        default:"Hey there! I am using Ping",
    },
    currentPost:{
        type:String,
        default:'',
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    location:{
        type:String,
        default:'Unknown'
    },
    profilePicture:{
        type:String,
        default:'https://res.cloudinary.com/di4uufzov/image/upload/v1761653855/ping/fflfqjp0jblis7ipwtkk.jpg'
    },
    backgroundImage:{
        type:String,
        default:'https://res.cloudinary.com/di4uufzov/image/upload/v1761655157/ping/a8pby3awpinprfuxofae.jpg'
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    ownPosts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }]
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;