import { Router, raw } from "express";
import { createCheckoutSession, customerPortal } from "../controllers/stripeController";
import { checkToken } from "../middleware/checkToken";

const router = Router();

router.post("/create-checkout-session", checkToken(true), createCheckoutSession);
router.post("/customer-portal", checkToken(true), customerPortal);

export default router;