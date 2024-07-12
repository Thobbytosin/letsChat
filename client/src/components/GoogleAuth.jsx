import React from "react";
import google from "../assets/google.png";

const GoogleAuth = () => {
  return (
    <button className=" w-12 h-12 bg-gray-300 bg-opacity-50 rounded-full flex justify-center items-center">
      <img src={google} alt="google_logo" />
    </button>
  );
};

export default GoogleAuth;
