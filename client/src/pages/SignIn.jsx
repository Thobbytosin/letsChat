import React, { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import toast from "react-hot-toast";
import client from "../lib/client";
import { SIGNIN_ROUTE } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store";

const SignIn = () => {
  const initialValues = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invalidCredentialsError, setinvalidCredentialsError] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  const validateSignIn = () => {
    if (!formData.email.length && !formData.password.length) {
      toast.error("All Fields are required");
      setError("All Fields are required");
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

    return true;
  };

  // handle form change
  const handleChange = (e) => {
    setError(false);
    setSuccess(false);
    setinvalidCredentialsError(false);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handle from submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccess(false);
      setError(false);
      setinvalidCredentialsError(false);

      if (validateSignIn()) {
        // submit form
        const { data } = await client.post(
          SIGNIN_ROUTE,
          {
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );

        if (data.profileSetup) {
          setSuccess(data.message);

          // update state
          setUserInfo(data.profile);

          const timer = setTimeout(() => {
            navigate("/chats");

            clearTimeout(timer);
          }, 2500);
        } else {
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
      setLoading(false);
      console.log("ERROR:", error);
      setError(error.response.data.message);
      toast.error(error.response.data.message);
      if (error.response.data.message === "Invalid credentials") {
        setinvalidCredentialsError(true);
      }
    }
  };

  return (
    <div className="p-6 font-poppins bg-slate-100 min-h-screen w-screen relative">
      <button onClick={() => navigate(-1)}>
        <AiOutlineArrowLeft size={24} />
      </button>

      <div className=" mt-8">
        <h2 className=" text-center font-semibold text-2xl text-secondary">
          Sign In
        </h2>
        <p className=" text-center mt-4 font-light text-sm">
          Welcome back! Sign in using your social account or email to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className=" mt-10">
        {/* EMAIL INPUT */}
        <div className=" mt-6">
          <label
            htmlFor="email"
            className={`font-medium text-sm ${
              invalidCredentialsError ? "text-red-500" : "text-secondary"
            }`}
          >
            {invalidCredentialsError ? "* Email" : "Email"}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            className={`block text-sm p-1 w-full outline-none bg-transparent border-b ${
              invalidCredentialsError
                ? "border-red-500 text-warning"
                : "border-gray"
            } mt-1`}
          />
        </div>
        {/* PASSWORD INPUT */}
        <div className=" mt-6 relative">
          <label
            htmlFor="password"
            className={`font-medium text-sm ${
              invalidCredentialsError ? "text-red-500" : "text-secondary"
            }`}
          >
            {invalidCredentialsError ? "* Password" : "Password"}
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            onChange={handleChange}
            className={`block text-sm p-1 w-full outline-none bg-transparent border-b ${
              invalidCredentialsError
                ? "border-red-500 text-warning"
                : "border-gray"
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

        {/* if error is true */}
        {error && <p className=" mt-3 text-warning text-sm">{error}</p>}
        {/* if success is true */}
        {success && <p className=" mt-3 text-success text-sm ">{success}</p>}

        {/* SUBMIT BUTTON */}
        <div className=" w-full mt-10 flex justify-center">
          <button
            disabled={loading}
            onSubmit={handleSubmit}
            className="bg-blue-gradient text-white px-24 text-center text-sm rounded-xl py-2.5 "
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </form>
      <p className=" font-light text-sm mt-20 text-center">
        Don't Have an account?
        <span className=" ml-2 font-medium underline">
          <button onClick={() => navigate("/register")} className=" underline">
            Sign Up
          </button>
        </span>
      </p>

      {/* LOADING SPINNER */}
      {loading && <Spinner />}
    </div>
  );
};

export default SignIn;
