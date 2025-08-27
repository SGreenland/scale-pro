import { Router } from "express";
import { getPitchData, addPitchData} from "../controllers/pitchDataController";
import { checkToken } from "../middleware/checkToken";

const router = Router();

const path = "/pitch-data";

router.get(path, checkToken(true), getPitchData);
router.post(path, checkToken(true), addPitchData);

export default router;
