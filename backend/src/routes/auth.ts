import { Router } from "express";
import { signup, login, checkTokenAndGetUser, resendVerificationEmail, markUserEmailAsVerified } from "../controllers/authController";

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

router.post("/resend-verification-email", resendVerificationEmail);

export default router;
