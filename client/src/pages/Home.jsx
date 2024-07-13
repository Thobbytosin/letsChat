import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

import { useNavigate } from "react-router-dom";
import GoogleAuth from "../components/GoogleAuth";

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlers = useSwipeable({
    onSwipedLeft: () =>
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, 1)),
    onSwipedRight: () =>
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0)),
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className=" bg-blue-gradient min-h-screen min-w-screen overflow-hidden "
    >
      {/* SLIDER */}
      <div
        className=" flex transition-all "
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {/* SLIDE 1 */}
        <div className=" relative min-w-full h-screen flex flex-col justify-evenly items-center">
          <div className=" font-poppins text-white ">
            <h2 className=" text-center text-[3rem] md:text-[6rem] font-medium flex gap-2">
              <span>LetsChat</span>
              <span>
                <div className=" rounded-full md:w-8 md:h-8 h-4 w-4 bg-white" />
              </span>
            </h2>
            <p className="text-sm md:text-lg text-center font-normal text-gray-200 italic">
              endless possibilities..
            </p>
          </div>
          {/* slider dots */}
          <div className=" w-full flex justify-center gap-2 absolute bottom-20 left-0">
            <div className=" w-3 h-3 bg-white rounded-full" />
            <div className=" w-3 h-3 border border-white  rounded-full" />
          </div>
        </div>

        {/* SLIDE 2 */}
        <div className=" bgImage relative min-w-full h-screen font-poppins flex flex-col justify-start text-white p-6">
          {/* OVERLAY */}
          <div className=" min-w-full h-full bg-black bg-opacity-55 absolute left-0 top-0" />
          {/* TITLE */}
          <div className=" text-white z-10 mt-6">
            <h2 className=" md:text-center text-[3rem] md:text-[5rem]">
              Connect Friends easily & quickly.
            </h2>
            <p className=" mt-4 text-gray-300 font-light md:text-center">
              Our chat app is the perfect way to stay connected with friends and
              family.
            </p>
          </div>

          {/* SIGNUP */}
          <div className=" mt-12 w-full flex flex-col items-center z-10">
            {/* GOOGLE SIGN IN */}
            <GoogleAuth />

            <div className=" w-full flex justify-center items-center gap-4 my-6">
              <div className=" w-20 h-[1px] bg-white" />
              <p>OR</p>
              <div className=" w-20 h-[1px] bg-white" />
            </div>

            {/* NORMAL SIGN UP */}
            <button
              onClick={() => navigate("/register")}
              className="bg-gray bg-opacity-80 text-black font-medium  px-24 text-center text-lg rounded-xl py-2"
            >
              Sign Up
            </button>
            <p className=" font-extralight text-sm mt-3">
              Already Have an account?
              <span className=" ml-2 font-medium underline">
                <button
                  onClick={() => navigate("/sign-in")}
                  className=" underline"
                >
                  Sign In
                </button>
              </span>
            </p>
          </div>
          {/* slider dots */}
          <div className=" w-full flex justify-center gap-2 absolute bottom-10 left-0">
            <div className=" w-3 h-3 border border-white  rounded-full" />
            <div className=" w-3 h-3 bg-white rounded-full" />
          </div>
        </div>
      </div>
      {/* SLIDER ENDS */}

      {/* <div className=" my-40 text-white">This is another section</div> */}
    </div>
  );
};

export default Home;
