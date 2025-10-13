import { Router } from "express";
import { get } from "../controllers/notePatternController";
import { checkToken } from "../middleware/checkToken";

const router = Router();

const path = "/note-patterns";

router.get(path, get);

export default router;
