import express from "express";
import {
  sendProfile,
  signIn,
  signOut,
  signUp,
  updateUserName,
} from "../controllers/auth.controller.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", isAuth, signOut);
router.get("/getProfile", isAuth, sendProfile);
router.post("/updateUsername/:id", isAuth, updateUserName);

export default router;
