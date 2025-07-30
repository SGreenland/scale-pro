import { Router } from "express";
import { get, post } from "../controllers/userSettingsController";

const router = Router();

const path = "/settings/:id";

router.get(path, get);
router.post(path, post);

export default router;
