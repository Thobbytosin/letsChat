import React from "react";
import {
  AiOutlineCamera,
  AiOutlineClose,
  AiOutlinePicture,
} from "react-icons/ai";

const BottomSlider = ({
  bottomSlider,
  color,
  closeSlider,
  selectImage,
  openCamera,
  openDeleteModal,
  isAvatarActive,
}) => {
  return (
    <div
      className={` transition-all duration-500  ${
        bottomSlider ? "-translate-y-[0%]" : "translate-y-[100%]"
      } w-full mIN-h-[150px] fixed bottom-0 left-0 z-30  text-white py-4 px-6 bg-black bg-opacity-95`}
    >
      {/* SLIDER RULE */}
      <div onClick={closeSlider} className="w-full flex justify-center">
        <div className="  w-24 h-[6px] bg-white bg-opacity-40 rounded-full cursor-pointer" />
      </div>

      {/* ITEMS */}
      <div className={` flex items-center gap-6 mt-4`}>
        {/* UPLOAD FROM CAMERA */}
        <div className=" w-20 text-center flex-col justify-center items-center ">
          <div
            onClick={openCamera}
            className=" w-14 h-14 bg-gray bg-opacity-15 rounded-full flex justify-center items-center cursor-pointer mx-auto mb-2"
          >
            <AiOutlineCamera color={color} size={24} />
          </div>
          <p className=" text-sm">Camera</p>
        </div>

        {/* UPLOAD FROM GALLERY */}
        <div className=" w-20 text-center gap-1 flex-col justify-center items-center ">
          <div
            onClick={selectImage}
            className=" w-14 h-14 bg-gray bg-opacity-15 rounded-full flex justify-center items-center cursor-pointer mx-auto mb-2"
          >
            <AiOutlinePicture color={color} size={24} />
          </div>
          <p className=" text-sm">Gallery</p>
        </div>

        {/* DELETE PROFILE IMAGE */}
        {isAvatarActive && (
          <div className="ml-8 min-w-20 text-center gap-1 flex-col justify-center items-center ">
            <div
              onClick={openDeleteModal}
              className=" w-14 h-14 bg-gray bg-opacity-15 rounded-full flex justify-center items-center cursor-pointer mx-auto mb-2"
            >
              <AiOutlineClose color="#ef4444" size={24} strokeWidth={36} />
            </div>
            <p className=" text-sm text-warning">Delete Image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomSlider;
