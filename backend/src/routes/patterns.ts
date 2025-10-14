import { Router } from "express";
import { get } from "../controllers/notePatternController";
import { checkToken } from "../middleware/checkToken";

const router = Router();

const path = "/note-patterns";
const unlockPath = "/note-patterns/unlock";

router.post(unlockPath, checkToken, get);

router.get(path, get);

export default router;
