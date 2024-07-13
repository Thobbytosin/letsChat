import React, { useEffect } from "react";
import { useAppStore } from "../store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";

const Chats = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (userInfo.profileSetup) {
  //     // toast.error("Please setup your profile to continue");
  //     navigate("/profile");
  //   }
  // }, [userInfo, navigate]);

  // hanlde Navigate
  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/profile");
    } else {
      toast.error("Please setup your profile");
    }
  };

  return (
    <div className="p-6">
      <button onClick={handleNavigate}>
        <AiOutlineArrowLeft size={24} />
      </button>
    </div>
  );
};

export default Chats;
