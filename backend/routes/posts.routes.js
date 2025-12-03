import express from 'express';
import {
    createPost,
    deletePost,
    getPost, getPostImages,
    getPostInfo,
    getRand,
    getRandMedia,
    Like,
    savedPost
} from "../controllers/post.controller.js";
const router = express.Router();
import {storage} from "../cloudConfig.js";
import multer from "multer";
import {verifyUser} from "../middleware/authMiddleware.js";
import { createComment, deleteComment, getComments } from '../controllers/comment.controller.js';

const upload = multer({ storage });

router.post("/createPost", verifyUser, upload.array("images", 10), createPost);
router.route("/getPost").get(getPost);
router.route("/getRand").post(verifyUser, getRand);
router.route("/getRandMedia").post(verifyUser, getRandMedia);
router.route("/deletePost").delete(verifyUser, deletePost);
router.route("/incrementLike").post(verifyUser, Like);
router.route("/getComments").get( getComments);
router.route("/createComment").post(verifyUser, createComment);
router.route("/deleteComment").delete(verifyUser,deleteComment);
router.route("/savePost").post(verifyUser, savedPost);
router.route("/postInfo").get(verifyUser, getPostInfo);
router.route("/getPostImages").get( getPostImages);

export default router;