import {Router} from 'express';
import {
    followUnfollowController, getFollowerList, getFollowingList,
    getOwnProfile,
    getPing, getUserProfileController,
    loginUser,
    profileFetched,
    registerUser,
    searchUser, updateProfileData,
    updateProfilePicture
} from "../controllers/user.controller.js";
import {verifyUser} from "../middleware/authMiddleware.js";
import { storage } from "../cloudConfig.js";
import multer from "multer";

const router = Router();
const upload = multer({storage});

router.route("/").get(getPing);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/fetchProfile", ).get(verifyUser, profileFetched);
router.route("/getOwnProfile").get(verifyUser, getOwnProfile);
router.route("/searchUser").get(verifyUser, searchUser);
router.route("/updateProfilePicture").post(verifyUser,upload.single("profilePicture"), updateProfilePicture);
router.route("/updateProfileData").post(verifyUser, updateProfileData);
router.route("/getUserProfile").get(verifyUser, getUserProfileController);
router.route("/updateFollowMethod").post(verifyUser, followUnfollowController);
router.route("/FollowingList").get(verifyUser,getFollowingList);
router.route("/FollowersList").get(verifyUser, getFollowerList);

export default router;