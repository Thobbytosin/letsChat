import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { isPasswordStrong } from "../utils/helpers.js";
import { isValidObjectId } from "mongoose";

export const signUp = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    // check if all fields are filled
    if (
      !userName ||
      !email ||
      !password ||
      userName.trim() === "" ||
      email.trim() === "" ||
      password === ""
    ) {
      return errorHandler(res, 400, "All fields are requird");
    }

    // check if userName already exists
    const userNameExists = await User.findOne({ userName });

    // if email already exists, return this message to the user, else continue
    if (userNameExists)
      return errorHandler(
        res,
        401,
        "UserName already exists. Please choose a another suggestion"
      );

    // check if email already exists
    const emailExists = await User.findOne({ email });

    // if email already exists, return this message to the user, else continue
    if (emailExists) return errorHandler(res, 401, "Email already exists");

    //   check password length
    if (password.length < 8)
      return errorHandler(res, 422, "Password must be at least 8 characters");

    //   check if password is strong enough
    if (!isPasswordStrong(password))
      return next(
        errorHandler(
          res,
          422,
          "Password must contain at least one Uppercase letter, one lowercase letter and a number"
        )
      );
    //   check if email is valid
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmailFormat = emailRegex.test(email);

    if (!isValidEmailFormat) return errorHandler(res, 400, "Invalid email");

    // encrypt the user password for account security
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // create a new user
    const user = new User({
      userName: userName.trim(),
      email: email.trim(),
      password: hashedPassword,
    });

    //  save it in the database
    await user.save();

    // create a access token for the user
    // sign in jsonwebtoken
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY
    );

    // save token in cookie
    res.cookie("accessToken", token, {
      // maxAge: 48 * 60 * 60 * 1000, // 2 day expiration
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    // send success response
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      profile: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        profileSetup: user.profileSetup,
        verified: user.verified,
        avatar: user.avatar,
      },
    });

    // save the access token to the db
    if (!user.tokens) user.tokens = [token];
    else user.tokens.push(token);

    // update database
    await user.save();
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check if all fields are filled
    if (!email || !password || email.trim() === "" || password.trim() === "") {
      return errorHandler(res, 400, "All fields are requird");
    }

    // check if email exists
    const user = await User.findOne({ email });

    // if user is not found
    if (!user) return errorHandler(res, 422, "Invalid credentials");

    // if user exists, check password
    const checkPassword = bcryptjs.compareSync(password, user.password);
    if (!checkPassword) return errorHandler(res, 422, "Invalid credentials");

    // sign in jsonwebtoken
    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET_KEY);

    // save the access token to the db
    if (!user.tokens) user.tokens = [token];
    else user.tokens.push(token);

    // also update the verified status to true
    user.verified = true;

    // save in database
    await user.save();

    // save token in cookie
    res.cookie("accessToken", token, {
      // maxAge: 48 * 60 * 60 * 1000, // 2 day expiration
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    // send response back
    res.status(200).json({
      message: "Signed successfully",
      success: true,
      profile: {
        id: user._id,
        userName: user.userName,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatar: user.avatar,
        profileSetup: user.profileSetup,
        color: user.color,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    const user = await User.findOne({ _id: req.user.id, tokens: accessToken });
    if (!user)
      return errorHandler(res, 401, "You must be logged into sign out");

    // remove token from database
    const newTokens = user.tokens.filter((token) => token !== accessToken);
    user.tokens = newTokens;

    // save
    await user.save();

    // remove token from cookies
    res.clearCookie("accessToken");

    // send response
    res.status(200).json({
      message: `Signed out. Hope to see you soon ${user?.userName}`,
    });
  } catch (error) {
    next(error);
  }
};

export const sendProfile = async (req, res, next) => {
  try {
    // res.status(200).json({ success: true, profile: req.user });
    res.status(200).json({ success: true, profile: req.user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    // get the user id
    const { id } = req.params;

    // check if the user is the owner of the account
    if (id !== req.user.id)
      return errorHandler(
        res,
        403,
        "Access denied: You have not been authorized to access this"
      );

    // the fields to be updated
    const { name, userName, color } = req.body;

    console.log(name, userName, color);

    // validate the name input
    if (!name || name.trim() === "" || !userName || userName.trim() === "")
      return errorHandler(res, 422, "All fields are required");

    // find the user with id and update
    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        userName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    if (!user) return errorHandler(res, 404, "User not found");

    res.status(200).json({
      success: true,
      message: "Your Profile has been updated ",
      profile: {
        id: user.id,
        name: user.name,
        userName: user.userName,
        email: user.email,
        verified: user.verified,
        profileSetup: user.profileSetup,
        avatar: user.avatar,
        color: user.color,
      },
    });
  } catch (error) {
    next(error);
  }
};
