import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { isPasswordStrong } from "../utils/helpers.js";
import { isValidObjectId } from "mongoose";

export const signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // check if all fields are filled
    if (
      !name ||
      !email ||
      !password ||
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      return errorHandler(res, 400, "All fields are requird");
    }

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
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    });

    //  save it in the database
    await user.save();

    // send success response
    res
      .status(201)
      .json({ message: "Account created successfully", data: user });
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    // save the access token to the db
    if (!user.tokens) user.tokens = [token];
    else user.tokens.push(token);

    await user.save();

    // send response back
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true, secure: true })
      .json({
        message: "Signed successfully",
        accessToken: token,
        profile: {
          id: user._id,
          name: user.name,
          email: user.email,
          verified: user.verified,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    const user = await User.findOne({ _id: res.user.id, tokens: accessToken });
    if (!user)
      return errorHandler(res, 401, "You must be logged into sign out");

    // remove token from database
    const newTokens = user.tokens.filter((token) => token !== accessToken);
    user.tokens = newTokens;

    // save
    await user.save();

    // remove token from cookies
    res.clearCookie("access_token");

    // send response
    res.status(200).json({
      message: `Signed out. Hope to see you soon ${user?.name}`,
    });
  } catch (error) {
    next(error);
  }
};

export const sendProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      profile: {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        avatar: res.user.avatar,
        verified: res.user.verified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserName = async (req, res, next) => {
  try {
    // get the user id
    const { id } = req.params;

    if (!isValidObjectId(id)) return errorHandler(res, 404, "Invaid Id");

    // the fields to be updated
    const { name } = req.body;

    // find the user with id
    const user = await User.findOne({
      _id: res.user.id,
      tokens: res.user.accessToken,
    });
    if (!user) return errorHandler(res, 404, "User not found");

    // // you should also be ble to update only your account
    // if (res.user.id !== id) return errorHandler(res, 403, "Permission denied");

    // validate the name input
    if (!name || name.trim() === "")
      return errorHandler(res, 422, "Name field is required");

    // check if new name is the same as existing name
    if (name === user.name)
      return errorHandler(
        res,
        422,
        "Name must be different from existing name"
      );

    // set new name
    user.name = name.trim();
    // save new name in database
    await user.save();

    res.status(200).json({
      message: "Username updated",
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};
