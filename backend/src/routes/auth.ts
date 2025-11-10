import { Router } from "express";
import { signup, login, checkTokenAndGetUser, resendVerificationEmail, markUserEmailAsVerified, resetPassword, resetPasswordEmail } from "../controllers/authController";
import { checkToken } from "../middleware/checkToken";
import ipEmailLimiter from "../middleware/ipEmailLimiter";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
});

router.post("/persist-login", checkTokenAndGetUser);
router.get("/verify-email", markUserEmailAsVerified);
router.post("/resend-verification-email", ipEmailLimiter, resendVerificationEmail);
router.post("/forgot-password", ipEmailLimiter, resetPasswordEmail);
router.post("/reset-password", checkToken(true), resetPassword);

export default router;
