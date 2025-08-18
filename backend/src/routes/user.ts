import { Router } from "express";
import { updatePassword, updateProfile, getProfile } from "../controllers/userProfileController";
import { checkToken } from "../middleware/checkToken";

const router = Router();

const profilePath = "/user/profile";
const passwordPath = "/user/password";

router.get(profilePath, checkToken(true), getProfile);
router.put(profilePath, checkToken(true), updateProfile);
router.put(passwordPath, checkToken(true), updatePassword);

export default router;
