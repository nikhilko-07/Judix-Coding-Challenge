import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Post from "../models/post.model.js";

export const getPing  = (req, res)=>{
    try {
        return res.json({message: "Hello World!"});
    }catch(e){
        res.status(500).send({"something went wrong":e});
        console.log(e);
    }
}

export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json("Please fill all the fields");
        }

        // Add Gmail domain validation
        if (!email.endsWith('@gmail.com')) {
            return res.status(400).json("Only Gmail accounts are allowed");
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
            email,
            password: hashedPassword,
        })
        await newUser.save();
        const newProfile = new Profile({userId: newUser._id, name:name});
        await newProfile.save();
        return res.status(200).json("User Created Successfully");

    } catch (e) {
        res.status(500).send({"something went wrong": e.message});
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
        const profile = await Profile.findOne({userId: user._id}).populate("ownPosts").select("-savedPosts");
        if(!profile){
            return res.status(400).json("Profile not found");
        }
        return res.status(200).json({ profile});
    }catch (e){
        console.log(e);
        res.status(500).send({"something went wrong":e});
    }
}

export const getOwnSavedPosts = async (req, res) => {
    try {
        const user = req.user;
        const profile = await Profile.findOne({ userId: user._id }).select("savedPosts");

        if (!profile) {
            return res.status(404).json("Profile not found");
        }

        if (!profile.savedPosts || profile.savedPosts.length === 0) {
            return res.status(200).json([]);
        }

        // ✅ Fix: Use Promise.all for async mapping + correct _id field
        const posts = await Promise.all(
            profile.savedPosts.map(postId => Post.findById(postId))
        );

        const validPosts = posts.filter(post => post !== null);

        return res.status(200).json(validPosts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}



export const searchUser = async(req, res) =>{
    try{
        const { query } = req.query;
        if(!query || query.trim() === ""){
            return res.status(200).json([]);
        }
        const user = await Profile.find({
            name:{$regex: query, $options: "i"},
        }).select("name profilePicture userId");

        return res.status(200).json(user)
    }catch(err){
        console.log(err);
        return res.status(500).send("Something went wrong at searchUser",err);
    }
}

export const updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Profile picture missing" });
        }

        const userId = req.user._id;

        const profile = await Profile.findOne({ userId });
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        profile.profilePicture = req.file.path;
        await profile.save();

        return res.status(200).json({ message: "Profile picture updated" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const updateProfileData = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, bio, location } = req.body;
        const profile = await Profile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        if (name) {
            const existingUser = await Profile.findOne({ name });

            if (existingUser && existingUser.userId.toString() !== userId.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "Username already exists"
                });
            }

            profile.name = name;
        }

        if (bio !== undefined) profile.bio = bio;
        if (location !== undefined) profile.location = location;

        await profile.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server error at updateProfileData"
        });
    }
};
export const getUserProfileController = async (req, res) => {
    try {
        const { _id } = req.query;
        if (!_id) {
            return res.status(400).json({ message: "User ID not provided" });
        }

        const user = await Profile.findOne({userId: _id}).select("-savedPosts");

        if (!user) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const followUnfollowController = async (req, res) => {
    try {
        const own_id = req.user._id;    // logged in user
        const { followingid } = req.body;  // target userId (not profile id)

        if (followingid.toString() === own_id.toString()) {
            return res.status(400).json({ message: "You can't follow yourself" });
        }

        // find profiles by userId
        const OwnProfile = await Profile.findOne({ userId: own_id });
        const FollowingProfile = await Profile.findOne({ userId: followingid });

        if (!FollowingProfile) {
            return res.status(404).json({ message: "Target profile not found" });
        }

        const isAlreadyFollowing =
            FollowingProfile.followers.includes(OwnProfile._id);

        // -------------------------
        //        UNFOLLOW
        // -------------------------
        if (isAlreadyFollowing) {
            await Profile.findByIdAndUpdate(
                OwnProfile._id,
                { $pull: { following: FollowingProfile._id } }
            );

            await Profile.findByIdAndUpdate(
                FollowingProfile._id,
                { $pull: { followers: OwnProfile._id } }
            );

            return res.status(200).json({ message: "User successfully unfollowed" });
        }

        // -------------------------
        //        FOLLOW
        // -------------------------
        await Profile.findByIdAndUpdate(
            OwnProfile._id,
            { $addToSet: { following: FollowingProfile._id } }
        );

        await Profile.findByIdAndUpdate(
            FollowingProfile._id,
            { $addToSet: { followers: OwnProfile._id } }
        );

        return res.status(200).json({ message: "User successfully followed" });

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err });
    }
};

export const getFollowingList = async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id) {
            return res.status(404).json({ message: "User ID not provided" });
        }

        const profile = await Profile.findById(_id)
            .select("following")
            .populate({
                path: "following",
                select: "name profilePicture bio userId -_id"  // fields to return
            });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json(profile);
    } catch (err) {
        return res.status(400).json({ message: "Something went wrong", error: err });
    }
};
export const getFollowerList = async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id) {
            return res.status(404).json({ message: "User ID not provided" });
        }

        const profile = await Profile.findById(_id)
            .select("followers")
            .populate({
                path: "followers",
                select: "name profilePicture bio userId -_id"  // fields to return
            });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json(profile);
    } catch (err) {
        return res.status(400).json({ message: "Something went wrong", error: err });
    }
};
