import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

// Middleware to check for access token: I.E IF USER IS SIGNED IN
export const checkAuth = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return errorHandler(res, 401, "Access Denied: No Token Provided!");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ email: decoded.email });
    if (!user) return errorHandler(res, 404, "User does not exist");

    req.user = {
      id: user.id,
      name: user.name,
      userName: user.userName,
      email: user.email,
      verified: user.verified,
      profileSetup: user.profileSetup,
      avatar: user.avatar,
      color: user.color,
      noAvatar: user.noAvatar,
    };

    next();
  } catch (err) {
    next(err);
  }
};
