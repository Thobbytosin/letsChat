import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: true,
      unique: [true, "username already exists"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profileSetup: {
      type: Boolean,
      default: false,
    },
    color: {
      type: Number,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    tokens: [String],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
