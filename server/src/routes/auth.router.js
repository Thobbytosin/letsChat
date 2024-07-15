import express from "express";
import {
  deleteAvatar,
  sendProfile,
  signIn,
  signOut,
  signUp,
  updateAvatar,
  updateProfile,
} from "../controllers/auth.controller.js";
import { checkAuth } from "../middleware/auth.js";
import { fileParser } from "../middleware/fileParser.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", checkAuth, signOut);
router.get("/getProfile", checkAuth, sendProfile);
router.post("/updateProfile/:id", checkAuth, updateProfile);
router.patch("/updateAvatar", checkAuth, fileParser, updateAvatar);
router.get("/deleteAvatar", checkAuth, deleteAvatar);

export default router;
