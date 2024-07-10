import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import pkg from "jsonwebtoken";

const { JsonWebTokenError, TokenExpiredError } = pkg;

export const isAuth = async (res, req, next) => {
  try {
    const authToken = req.req.headers.authorization;
    if (!authToken) return next(errorHandler(403, "unauthorized request"));

    const token = authToken.split("Bearer ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(payload.id);
    if (!user) return next(errorHandler(404, "User does not exist"));

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar,
      accessToken: token,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(errorHandler(401, "Session expired"));
    }
    if (error instanceof JsonWebTokenError)
      return next(errorHandler(401, "Unauthorized"));

    next(error);
  }
};
