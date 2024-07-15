import React, { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store";
import Spinner from "./ui/Spinner";
import { colorsBg, colorsCodes, getColor } from "../utils/colors.js";
import { AiFillCamera } from "react-icons/ai";
import toast from "react-hot-toast";
import client from "../lib/client";
import {
  DELETE_USERAVATAR_ROUTE,
  UPDATE_USERAVATAR_ROUTE,
  UPDATE_USERINFO_ROUTE,
} from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import ImageModal from "../components/ImageModal";
import BottomSlider from "./ui/BottomSlider";
import CameraWindow from "./ui/CameraWindow";
import DeleteModal from "../components/DeleteModal";
import BackButton from "./ui/BackButton";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const [selectedColor, setSelectedColor] = useState(0);
  const initialValues = {
    name: userInfo.name || "",
    userName: userInfo.userName,
    color: userInfo.color ? userInfo.color : selectedColor,
  };
  const [formData, setFormData] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState(null);
  const [enterNameError, setEnterNameError] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [bottomSlider, setBottomSlider] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.color) {
      setSelectedColor(userInfo.color);
    }
    if (userInfo.avatar?.url) {
      setImage(userInfo.avatar?.url);
    } else {
      setImage(userInfo.noAvatar);
    }
  }, [userInfo]);

  const validateData = () => {
    if (
      !formData.userName ||
      (!formData.userName.trim() === "" && !formData.name) ||
      (!formData.name === "" && !formData.color)
    ) {
      toast.error("All fields are required");
      return false;
    }

    if (!formData.userName) {
      setUserNameError(true);
      toast.error("User Name is required");
      return false;
    }

    if (!formData.name) {
      setEnterNameError(true);
      toast.error("Please enter your name");
      return false;
    }

    return true;
  };

  // handle form change
  const handleChange = (e) => {
    setEnterNameError(false);
    setUserNameError(false);
    setError(false);
    setSuccess(false);

    setFormData({
      ...formData,
      color: selectedColor,
      [e.target.id]: e.target.value,
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("clicked");

    try {
      setLoading(true);
      setError(false);
      setUserNameError(false);
      setEnterNameError(false);
      setSuccess(false);

      if (validateData()) {
        const { data } = await client.post(
          UPDATE_USERINFO_ROUTE + userInfo.id,
          formData,
          { withCredentials: true }
        );
        if (data.success) {
          toast.success(data.message);
          setSuccess(data.message);
          setUserInfo(data.profile);

          const timer = setTimeout(() => {
            navigate("/chats");

            clearTimeout(timer);
          }, 2500);
        }
      }
    } catch (error) {
      setError(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // handle Navigate back to chats
  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chats");
    } else {
      toast.error("Please setup your profile");
    }
  };

  // PROFILE IMAGE FUNCTIONS

  const handleFileInputClick = () => {
    setBottomSlider(false);

    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const form = new FormData();
      form.append("avatar", file);

      try {
        setLoading(true);
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
      }
    }
  };

  const handleImageDelete = async (e) => {
    setBottomSlider(false);
    setOpenDeleteModal(false);

    try {
      setLoading(true);

      const { data } = await client.get(DELETE_USERAVATAR_ROUTE, {
        withCredentials: true,
      });
      if (data.success) {
        setUserInfo(data.profile);
        toast.success(data.message);
      }
    } catch (error) {
      toast(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profilBg relative w-screen h-screen flex justify-center items-center font-poppins">
      {/* OVERLAY */}
      <div className=" absolute left-0 top-0 w-screen h-screen bg-backgroundGray bg-opacity-65" />

      {/* BACK BUTTON */}
      <BackButton navigate={handleNavigate} />

      <div className=" z-10">
        <div className=" flex justify-center items-center gap-6">
          {/* AVATAR */}
          <div
            className={`relative w-24 h-24  rounded-full p-1 cursor-pointer border-2 ${getColor(
              selectedColor
            )} `}
          >
            <div
              onClick={() => setImageModal(true)}
              className=" cursor-pointer w-full h-full overflow-clip border-transparent rounded-full"
            >
              <img src={image} alt="avatar" className=" object-cover" />
            </div>
            <div
              onClick={() => setBottomSlider((prev) => !prev)}
              className={`cursor-pointer absolute bottom-0 -right-3 w-8 h-8 rounded-full flex justify-center items-center bg-white ${getColor(
                selectedColor
              )}`}
            >
              <AiFillCamera color="#000" />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className=" hidden"
              onChange={handleImageChange}
              name="avatar"
              accept="image/*"
            />
          </div>

          {/* FORM */}
          <div onClick={() => setBottomSlider(false)}>
            <form onSubmit={handleSubmit}>
              {/* EMAIL INPUT */}
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userInfo.email}
                  disabled
                  className={`block text-sm p-2 w-full outline-none rounded-md border-black text-gray border-b  bg-white
              mt-1`}
                />
              </div>
              {/* USERNAME */}
              <div className=" mt-6 relative">
                {userNameError && (
                  <span className=" text-warning absolute -left-1 top-2">
                    *
                  </span>
                )}
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  placeholder={userInfo.userName}
                  onChange={handleChange}
                  className={`block text-sm p-2 w-full outline-none rounded-md ${
                    userNameError
                      ? "border-warning border-b-2"
                      : "border-black border-b "
                  } bg-transparent 
              mt-1`}
                />
              </div>
              {/* NAME */}
              <div className=" mt-6 relative">
                {enterNameError && (
                  <span className=" text-warning absolute -left-1 top-2">
                    *
                  </span>
                )}
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={userInfo.name || "Name"}
                  onChange={handleChange}
                  className={`block text-sm p-2 w-full outline-none rounded-md ${
                    enterNameError
                      ? "border-warning border-b-2"
                      : "border-black border-b "
                  } bg-transparent 
              mt-1`}
                />
              </div>
            </form>

            {/* COLORS */}
            <div className=" flex gap-3 mt-5">
              {colorsBg.map((color, index) => (
                <div
                  onClick={() => {
                    setFormData({ ...formData, color: index });
                    setSelectedColor(index);
                  }}
                  key={index}
                  className={`rounded-full cursor-pointer w-8 h-8 ${color} ${
                    selectedColor === index && "border-2 border-black"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className=" w-full mt-10 flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-gradient text-white   px-24 text-center text-sm rounded-xl py-2.5 "
          >
            Save Changes
          </button>
        </div>

        {/* if error is true */}
        {error && (
          <p className=" mt-3 px-6 text-warning text-sm text-center">{error}</p>
        )}
        {/* if success is true */}
        {success && (
          <p className=" mt-3 text-success text-sm text-center">{success}</p>
        )}
      </div>

      {/* BOTTOM SLIDER */}

      <BottomSlider
        bottomSlider={bottomSlider}
        color={colorsCodes[userInfo.color ? userInfo.color : selectedColor]}
        closeSlider={() => setBottomSlider(false)}
        selectImage={handleFileInputClick}
        openCamera={() => {
          setBottomSlider(false);
          setOpenCamera(true);
        }}
        openDeleteModal={() => setOpenDeleteModal(true)}
        isAvatarActive={userInfo.avatar?.url}
      />

      {/* CAMERA */}
      {openCamera && <CameraWindow closeCamera={() => setOpenCamera(false)} />}

      {/* MODAL */}
      {imageModal && (
        <ImageModal
          image={image}
          close={() => {
            setBottomSlider(false);
            setImageModal(false);
          }}
          closeBottomSlider={() => setBottomSlider(false)}
          toggleBottomSlider={() => setBottomSlider((prev) => !prev)}
          loading={loading}
        />
      )}

      {/* DELETE MODAL */}
      {openDeleteModal && (
        <DeleteModal
          closeModal={() => {
            setBottomSlider(false);
            setOpenDeleteModal(false);
          }}
          deleteImage={handleImageDelete}
        />
      )}

      {/* loading spinner */}
      {loading && <Spinner />}
    </div>
  );
};

export default Profile;
