import React from "react";

const DeleteModal = ({ closeModal, deleteImage }) => {
  return (
    <div className=" fixed left-0 top-0 w-full h-screen bg-black z-30 flex justify-center items-center  bg-opacity-85 ">
      <div className=" w-[70%] mx-auto bg-white rounded-lg p-4">
        <p className=" text-[16px] font-medium text-center">
          Are sure you want to delete?
        </p>
        <div className=" flex items-center justify-end mt-4 gap-4">
          <button
            onClick={closeModal}
            className=" text-sm px-3 py-1.5 bg-slate-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={deleteImage}
            className=" text-sm px-3 py-1.5 bg-warning text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
