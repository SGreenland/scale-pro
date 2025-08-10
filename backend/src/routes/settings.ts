import { Router } from "express";
import { get, post } from "../controllers/userSettingsController";
import { checkToken } from "../middleware/checkToken";

const router = Router();

const path = "/settings";

router.get(path, checkToken(true), get);
router.post(path, checkToken(true), post);

export default router;
