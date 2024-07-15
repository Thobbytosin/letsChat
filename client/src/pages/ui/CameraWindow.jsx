import React from "react";
import CustomWebCam from "../../components/CustomWebCam";

const CameraWindow = ({ closeCamera }) => {
  return (
    <div className=" fixed left-0 top-0 w-full h-screen bg-black z-30 flex justify-center items-center ">
      <CustomWebCam closeCamera={closeCamera} />
    </div>
  );
};

export default CameraWindow;
