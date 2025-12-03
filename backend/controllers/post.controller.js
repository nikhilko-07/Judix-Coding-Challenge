import Post from "../models/post.model.js";
import mongoose from "mongoose";
import Profile from "../models/profile.model.js";
import Comment from "../models/comments.model.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user;

    if (!content) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const images = req.files.map((file) => ({
      path: file.path,
      filename: file.filename,
    }));

    const post = new Post({
      content,
      userId: user._id,
      images,
    });

    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    await post.save();
    await Profile.updateOne(
      { userId: user._id },
      { $push: { ownPosts: post._id } }
    );
    return res.status(201).json({ message: "Post successfully created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong..." });
  }
};

export const getPost = async (req, res) => {
  try {
    const getPost = await Post.find({});
    if (!getPost || getPost.length === 0) {
      return res.status(404).send({ message: "No post found" });
    }
    const pipeline = [];
    pipeline.push({ $sample: { size: 1 } });
    const data = await Post.aggregate(pipeline);
    const postId = data.map((post) => post._id);
    return res.status(200).send(postId);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Something went wrong..." });
  }
};

export const getRand = async (req, res) => {
  try {
    const { previouslySeenIds = [] } = req.body;
    const pipeline = [];

    // Exclude already seen posts
    if (previouslySeenIds.length > 0) {
      pipeline.push({
        $match: {
          _id: {
            $nin: previouslySeenIds.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        },
      });
    }

    // Get 5 random posts
    pipeline.push({ $sample: { size: 10 } });

    // Fetch random posts
    let posts = await Post.aggregate(pipeline);

    // Track seen posts
    posts.forEach((p) => previouslySeenIds.push(p._id.toString()));

    // Extract user IDs
    const userIds = posts.map((p) => p.userId);

    // Fetch profiles of those users
    const profiles = await Profile.find({ userId: { $in: userIds } }).select(
      "name profilePicture userId followers"
    );

    // ✅ FIXED PART
    let profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.userId.toString(), p));

    // Merge profile with posts
    const combined = posts.map((p) => {
      const userKey = p.userId ? p.userId.toString() : null;
      return {
        ...p,
        user: userKey ? profileMap.get(userKey) || null : null,
      };
    });

    // Send response
    return res.status(200).json({
      posts: combined,
      nextPreviouslySeenIds: previouslySeenIds,
    });
  } catch (err) {
    console.error("Error in getRand:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getRandMedia = async (req, res) => {
  try {
    const { previousSeenMedia = [] } = req.body;
    const pipeline = [];

    // Exclude already seen media
    if (previousSeenMedia.length > 0) {
      pipeline.push({
        $match: {
          _id: {
            $nin: previousSeenMedia.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        },
      });
    }

    // Get 8 random media
    pipeline.push({ $sample: { size: 20 } });

    // Fetch random posts
    let posts = await Post.aggregate(pipeline);

    // Track seen posts
    posts.forEach((p) => previousSeenMedia.push(p._id.toString()));

    // Send response
    return res.status(200).json({
      posts,
      nextPreviouslySeenMedia: previousSeenMedia, // ✅ use same naming convention
    });
  } catch (err) {
    console.error("Error in getRandMedia:", err);
    return res.status(400).send({ message: "Server error at getRandMedia" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.body;
    const userdata = req.user._id;
    if (!userdata || !id) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return res.status(400).send({ message: "Post does not exist" });
    }
    if (userdata.toString() !== post.userId.toString()) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }

    await Comment.deleteMany({ postId: post._id });
    await Profile.updateMany({savedPosts:post._id},{$pull:{savedPosts: post._id}});
    await Post.deleteOne({ _id: post._id });

    return res.status(201).send({ message: "Post supccessfully deleted" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Something went wrong..." });
  }
};

export const Like = async (req, res) => {
  try {
    const { post_id } = req.body;
    const userId = req.user._id.toString();
    if (!userId || !post_id) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(400).send({ message: "Post does not exist" });
    }
    if (post.likes.includes(userId)) {
      await Post.findByIdAndUpdate(
        post,
        { $pull: { likes: userId } },
        { new: true }
      );
      return res.status(201).send({ message: "Done Unlike" });
    }
    await Post.findByIdAndUpdate(
      post,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    return res.status(201).send({ message: "Done like" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Something went wrong..." });
  }
};

export const savedPost = async (req, res) => {
  try {
    const { post_id } = req.body;
    const user = req.user._id;
    if (!post_id) return res.status(400).send("Not Provide postId");
    const profile = await Profile.findOne({ userId: user });
    if (!profile) return res.status(400).send("Unauthorized");
    if (profile.savedPosts.includes(post_id)) {
      await Profile.findByIdAndUpdate(
        profile._id,
        { $pull: { savedPosts: post_id } },
        { new: true }
      );
      return res.status(201).send({ message: "Done unsave the post" });
    } else {
      await Profile.findByIdAndUpdate(
        profile._id,
        { $addToSet: { savedPosts: post_id } },
        { new: true }
      );
    }
    return res.status(201).send({ message: "Done save the post" });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ message: "Something went wrong at saved Post" });
  }
};
export const getPostInfo = async (req, res) => {
  try {
    const { post_id } = req.query;

    if (!post_id) {
      return res.status(400).json({ message: "Post ID not provided" });
    }

    // 1️⃣ Find post
    const post = await Post.findById(post_id).populate("images content");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 2️⃣ Find all comments for this post (latest first)
    const comments = await Comment.find({ postId: post._id })
      .sort({ createdAt: -1 })
      .select("_id postId userId body createdAt");

    if (comments.length === 0) {
      return res.status(200).json({ postId: post._id, comments: [] });
    }

    // 3️⃣ Fetch all user profiles for every comment (including duplicates)
    const allUserIds = comments.map((c) => c.userId);
    const profiles = await Profile.find({ userId: { $in: allUserIds } })
      .select("userId name profilePicture bio");

    // 4️⃣ Merge: each comment gets its own user info
    const commentsWithUser = comments.map((comment) => {
      const user = profiles.find(
        (p) => p.userId.toString() === comment.userId.toString()
      );
      return {
        _id: comment._id,
        postId: comment.postId,
        userId: comment.userId,
        body: comment.body,
        createdAt: comment.createdAt,
        name: user?.name || "Unknown User",
        profilePicture: user?.profilePicture || "",
        bio: user?.bio || "",
      };
    });

    // 5️⃣ Return
    return res.status(200).json({
      postImages:post,
      postId: post._id,
      comments: commentsWithUser,
      totalComments: commentsWithUser.length,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong in getPostInfo", error: err.message });
  }
}

export const getPostImages = async (req, res)=>{
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "Post ID not provided" });
    const posts = await Post.find({userId}).populate("images");
    if (!posts) {
      return res.status(400).json({ message: "Post not Found" });
    }
    return res.status(200).json({
      totalPosts: posts.length,
      posts
    });

  }catch (err){
    return res.status(400).json({ message: "Post not found", err });
  }
}
