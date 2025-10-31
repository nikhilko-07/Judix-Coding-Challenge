import express from 'express';
import {createPost, deletePost, getPost, getRand} from "../controllers/post.controller.js";
const router = express.Router();
import {storage} from "../cloudConfig.js";
import multer from "multer";
import {verifyUser} from "../middleware/authMiddleware.js";

const upload = multer({ storage });

router.post("/createPost", verifyUser, upload.array("images", 10), createPost);
router.route("/getPost").get(getPost);
router.route("/getRand").post(verifyUser, getRand);
router.route("/deletePost").delete(deletePost);

export default router;