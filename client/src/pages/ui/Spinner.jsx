import React from "react";

const Spinner = () => {
  return (
    <div className=" absolute left-0 top-0 w-screen h-screen flex justify-center items-center z-10 bg-backgroundGray bg-opacity-65 ">
      <div class="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Spinner;
