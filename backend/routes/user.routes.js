import {Router} from 'express';
import {getOwnProfile, getPing, loginUser, profileFetched, registerUser} from "../controllers/user.controller.js";
import {verifyUser} from "../middleware/authMiddleware.js";


const router = Router();


router.route("/").get(getPing);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/fetchProfile", ).get(verifyUser, profileFetched);
router.route("/getOwnProfile").get(verifyUser, getOwnProfile);

export default router;