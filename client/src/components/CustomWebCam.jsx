import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiFillCamera, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import Webcam from "react-webcam";
import client from "../lib/client";
import { UPDATE_USERAVATAR_ROUTE } from "../utils/constants";
import toast from "react-hot-toast";
import { useAppStore } from "../store";
import Spinner from "../pages/ui/Spinner";

const CustomWebCam = ({ closeCamera }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [image, setImage] = useState(null);
  const [mirrored, setMirrored] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const { setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(false);

  // capture function
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  //   retake photo
  const retake = () => {
    setImgSrc(null);
  };

  const decodeImage = () => {
    // Convert data URL to Blob
    const byteString = atob(imgSrc?.split(",")[1]);
    const mimeString = imgSrc?.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    return blob;
    // const formData = new FormData()
    // formData.append('avatar', blob, 'capture')
  };

  useEffect(() => {
    const data = imgSrc && decodeImage();

    setImage(data);
  }, [imgSrc]);

  //   handle upload to server
  const handleUpload = async () => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("avatar", image, "capture");

      const { data } = await client.patch(UPDATE_USERAVATAR_ROUTE, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (data.success) {
        setUserInfo(data.profile);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      closeCamera();
    }
  };

  //   toggle for selfie
  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  return (
    <div className=" w-full">
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam
          audio={false}
          screenshotFormat="image/jpeg"
          height={600}
          width={600}
          ref={webcamRef}
          screenshotQuality={1}
          mirrored={mirrored}
          videoConstraints={{ facingMode }}
        />
      )}

      <div className=" mt-16 w-full  ">
        {imgSrc ? (
          <div className=" w-[100%] flex justify-evenly items-center">
            <button onClick={retake}>
              <AiOutlineClose size={34} strokeWidth={40} color="#ef4444" />
            </button>
            <button onClick={handleUpload}>
              <AiOutlineCheck size={34} strokeWidth={40} color="#22c55e" />
            </button>
          </div>
        ) : (
          <div className=" w-[100%] flex justify-evenly items-center">
            <button onClick={closeCamera}>
              <AiOutlineClose size={34} strokeWidth={40} color="#fff" />
            </button>
            <button
              onClick={capture}
              className=" p-2 border border-white rounded-full"
            >
              <div className=" w-20 h-20 rounded-full bg-blue-500 shadow-md shadow-slate-800" />
            </button>
            <button onClick={toggleCamera}>
              <AiFillCamera size={34} color="#fff" />
            </button>
          </div>
        )}
      </div>

      {loading && <Spinner />}
    </div>
  );
};

export default CustomWebCam;
