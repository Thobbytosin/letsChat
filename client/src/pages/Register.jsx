import React, { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import toast from "react-hot-toast";
import client from "../lib/client";
import { SIGNUP_ROUTE } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store";
import Spinner from "./ui/Spinner";

const Register = () => {
  const initialValues = {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [emailExistsAlready, setEmailExistsAlready] = useState(false);
  const [userNameExistsAlready, setUserNameExistsAlready] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  const validateSignup = () => {
    if (
      !formData.userName &&
      !formData.email.length &&
      !formData.password.length &&
      !formData.confirmPassword.length
    ) {
      toast.error("All Fields are required");
      setError("All Fields are required");
      return false;
    }

    if (!formData.userName.length) {
      toast.error("UserName is required");
      return false;
    }

    if (!formData.email.length) {
      toast.error("Email is required");
      return false;
    }

    if (!formData.password.length) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordNotMatch(true);
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  // handle form change
  const handleChange = (e) => {
    setError(false);
    setSuccess(false);
    setEmailExistsAlready(false);
    setUserNameExistsAlready(false);
    setPasswordNotMatch(false);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handle from submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccess(false);
      setError(false);
      setEmailExistsAlready(false);
      setUserNameExistsAlready(false);
      setPasswordNotMatch(false);

      if (validateSignup()) {
        // submit form
        const { data } = await client.post(
          SIGNUP_ROUTE,
          {
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );

        if (data.success) {
          toast.success(data.message);
          setSuccess(data.message);

          // update state
          setUserInfo(data.profile);

          const timer = setTimeout(() => {
            navigate("/profile");

            clearTimeout(timer);
          }, 2500);
        }
      }
    } catch (error) {
      console.log("ERROR:", error);
      setError(error.response.data.message);
      toast.error(error.response.data.message);
      // ui error message for email already exists
      if (error.response.data.message === "Email already exists") {
        setEmailExistsAlready(true);
      }

      // ui error message for username already exists
      if (
        error.response.data.message ===
        "UserName already exists. Please choose a another suggestion"
      ) {
        setUserNameExistsAlready(true);
      }
    } finally {
      setLoading(false);
    }

    return setLoading(false);
  };

  return (
    <div className="p-6 font-poppins bg-slate-100 min-h-screen w-screen relative">
      <button onClick={() => navigate(-1)}>
        <AiOutlineArrowLeft size={24} />
      </button>

      <div className=" mt-8">
        <h2 className=" text-center font-semibold text-2xl text-secondary">
          Sign Up
        </h2>
        <p className=" text-center mt-4 font-light text-sm">
          Get chatting with friends and family today by signing up for our chat
          app!
        </p>
      </div>

      <form onSubmit={handleSubmit} className=" mt-10">
        {/* USERNAME INPUT */}
        <div className=" mt-6">
          <label
            htmlFor="userName"
            className={`font-medium text-sm ${
              userNameExistsAlready ? "text-red-500" : "text-secondary"
            }`}
          >
            {userNameExistsAlready ? "* UserName" : "UserName"}
          </label>
          <input
            type="userName"
            id="userName"
            name="userName"
            onChange={handleChange}
            className={`block text-sm p-1 w-full outline-none bg-transparent border-b ${
              userNameExistsAlready
                ? "border-red-500 text-warning"
                : "border-gray"
            } mt-1`}
          />
        </div>
        {/* EMAIL INPUT */}
        <div className=" mt-6">
          <label
            htmlFor="email"
            className={`font-medium text-sm ${
              emailExistsAlready ? "text-red-500" : "text-secondary"
            }`}
          >
            {emailExistsAlready ? "* Email" : "Email"}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            className={`block text-sm p-1 w-full outline-none bg-transparent border-b ${
              emailExistsAlready ? "border-red-500 text-warning" : "border-gray"
            } mt-1`}
          />
        </div>
        {/* PASSWORD INPUT */}
        <div className=" mt-6 relative">
          <label
            htmlFor="password"
            className={`font-medium text-sm ${
              passwordNotMatch ? "text-red-500" : "text-secondary"
            }`}
          >
            {passwordNotMatch ? "* Password" : "Password"}
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            onChange={handleChange}
            className={`block text-sm p-1 w-full outline-none bg-transparent border-b ${
              passwordNotMatch ? "border-red-500 text-warning" : "border-gray"
            } mt-1`}
          />
          <div
            onClick={() => setShowPassword((prev) => !prev)}
            className=" absolute right-0 top-5 cursor-pointer"
          >
            {showPassword ? (
              <AiOutlineEye size={20} />
            ) : (
              <AiOutlineEyeInvisible color="#9ca3af" size={20} />
            )}
          </div>
        </div>
        {/* CONFIRM PASSWORD */}
        <div className=" mt-6 relative">
          <label
            htmlFor="confirmPassword"
            className={`font-medium text-sm ${
              passwordNotMatch ? "text-red-500" : "text-secondary"
            }`}
          >
            {passwordNotMatch ? "* Confirm Password" : "Confirm Password"}
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            onChange={handleChange}
            className={`block text-sm p-1 w-full outline-none bg-transparent border-b ${
              passwordNotMatch ? "border-red-500 text-warning" : "border-gray"
            } mt-1`}
          />
          <div
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className=" absolute right-0 top-5 cursor-pointer"
          >
            {showConfirmPassword ? (
              <AiOutlineEye size={20} />
            ) : (
              <AiOutlineEyeInvisible color="#9ca3af" size={20} />
            )}
          </div>
        </div>
        {/* if error is true */}
        {error && <p className=" mt-3 text-warning text-sm">{error}</p>}
        {/* if success is true */}
        {success && <p className=" mt-3 text-success text-sm ">{success}</p>}
        {/* SUBMIT BUTTON */}
        <div className=" w-full mt-10 flex justify-center">
          <button
            disabled={loading}
            onSubmit={handleSubmit}
            className="bg-blue-gradient text-white  px-24 text-center text-sm rounded-xl py-2.5 "
          >
            Sign Up
          </button>
        </div>
      </form>
      <p className=" font-light text-sm mt-3 text-center">
        Already Have an account?
        <span className=" ml-2 font-medium underline">
          <button onClick={() => navigate("/sign-in")} className=" underline">
            Sign In
          </button>
        </span>
      </p>

      {/* LOADING SPINNER */}
      {loading && <Spinner />}
    </div>
  );
};

export default Register;
