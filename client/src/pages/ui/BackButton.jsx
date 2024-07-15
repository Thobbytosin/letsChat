import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

const BackButton = ({ navigate }) => {
  return (
    <button onClick={navigate} className=" absolute left-6 top-6">
      <AiOutlineArrowLeft size={24} />
    </button>
  );
};

export default BackButton;
