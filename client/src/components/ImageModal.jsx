import React from "react";
import { AiFillEdit, AiOutlineClose } from "react-icons/ai";
import BottomSlider from "../pages/ui/BottomSlider";
import Spinner from "../pages/ui/Spinner";

const ImageModal = ({
  image,
  close,
  toggleBottomSlider,
  closeBottomSlider,
  loading,
}) => {
  return (
    <div className=" absolute left-0 top-0 w-screen h-screen bg-black flex-col justify-center items-center z-20">
      <div className=" h-[150px] p-6 flex justify-between cursor-pointer">
        <AiOutlineClose
          strokeWidth="40px"
          color="#fff"
          size={24}
          onClick={close}
        />
        <AiFillEdit
          color="#fff"
          size={24}
          onClick={toggleBottomSlider}
          className=" cursor-pointe z-30r"
        />
      </div>
      <div onClick={closeBottomSlider} className=" w-screen h-[350px] bg-white">
        <img
          src={image}
          alt="user_avatar"
          className=" object-cover w-full h-full"
        />
      </div>

      {loading && <Spinner />}
    </div>
  );
};

export default ImageModal;
