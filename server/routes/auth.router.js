import express from "express";
import {
  sendProfile,
  signIn,
  signOut,
  signUp,
  updateProfile,
} from "../controllers/auth.controller.js";
import { checkAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", checkAuth, signOut);
router.get("/getProfile", checkAuth, sendProfile);
router.post("/updateProfile/:id", checkAuth, updateProfile);

export default router;
