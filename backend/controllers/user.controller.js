import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const getPing  = (req, res)=>{
    try {
        return res.json({message: "Hello World!"});
    }catch(e){
        res.status(500).send({"something went wrong":e});
        console.log(e);
    }
}

export const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json("Please fill all the fields");
        }
        const user = await User.findOne({email });
        if(user){
            return res.status(400).json("User already exists");
        }
        const existingUserName = await User.findOne({name});
        if(existingUserName){
            return res.status(400).json("UserName already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name,
            email,
            password:hashedPassword,
        })
        await newUser.save();
        const newProfile = new Profile({userId: newUser._id});
        await newProfile.save();
        return res.status(200).json("User Created Successfully");

    }catch (e){
        res.status(500).send({"something went wrong":e});
        console.log(e);
    }
}

export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json("Please fill all the fields");
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json("User not found");
        }
        const passwordHash = await bcrypt.compare(password,user.password);
        if(!passwordHash){
            return res.status(400).json("Wrong Password");
        }
        const token = crypto.randomBytes(16).toString("hex");
        await User.updateOne({_id: user._id}, {token: token});
        return res.status(200).json({token});

    }catch (e){
        res.status(500).json({"something went wrong":e});
        console.log(e);
    }
}

export const profileFetched = async (req, res)=>{
    try {
        const user = req.user;
        const profile = await Profile.findOne({userId: user._id});
        if(!profile){
            return res.status(400).json("User not found");
        }
        return res.status(200).json({ success: true});
    }catch(e){
        console.error(e);
        return res.status(500).send({"something went wrong":e});
    }
}

export const getOwnProfile = async (req, res)=>{
    try {
        const user = req.user;
        const profile = await Profile.findOne({userId: user._id}).populate("ownPosts").lean();
        if(!profile){
            return res.status(400).json("Profile not found");
        }
        // Remove sensitive data manually
        const { password, ...safeUser } = user._doc ? user._doc : user;

        const userData = {
            name: safeUser.name,
            // email: safeUser.email,
        };

        return res.status(200).json({ profile, user: userData });
    }catch (e){
        console.log(e);
        res.status(500).send({"something went wrong":e});
    }
}