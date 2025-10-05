import React, { useEffect, useState } from "react";
import defaultImage from "../assets/default.jpg";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../redux/actions.js/userAction";
import { Bounce, toast } from "react-toastify";
import Avatar from "./user/Avatar";
const EditUserDetails = ({ onClose, user }) => {
  const [userData, setUserData] = useState({
    name: user?.user?.name,
    avatar: user?.user?.avatar.url,
    avatarPrev: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState == 2) {
          setUserData({
            ...userData,
            avatarPrev: reader.result,
            avatar: e.target.files[0],
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    const myForm = new FormData();
    myForm.set("name", userData?.name);
    myForm.set("avatar", userData?.avatar);
    dispatch(updateUserInfo(myForm));
    onClose();
  };
  const handleClickOutside = (e) => {
    if (e.target.id === "modal-background") {
      onClose();
    }
  };
  return (
    <div
      id="modal-background"
      onClick={handleClickOutside}
      className=" fixed top-0 left-0 right-0 bottom-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10"
    >
      <div className="bg-white p-6 w-full max-w-sm m-1 rounded-lg shadow-lg transform transition-all duration-300">
        <h2 className="font-semibold text-lg mb-2">Profile details</h2>
        <p className="text-sm text-gray-600 mb-4">Edit your details</p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData?.name}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 text-sm"
            />
          </div>
          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Photo</div>
            <div className="my-1 flex items-center gap-4">
              <Avatar
                className="h-16 w-16 border-4 border-gray-300 hover:scale-105"
                image={
                  userData?.avatarPrev ? userData.avatarPrev : userData?.avatar
                }
              />
              <label
                htmlFor="avatar"
                className="cursor-pointer bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150 transform hover:-translate-y-1"
              >
                Change photo
                <input
                  type="file"
                  id="avatar"
                  className="hidden"
                  onChange={handleChange}
                  name="avatar"
                />
              </label>
            </div>
          </div>
          <div className="p-[0.5px] bg-slate-200 my-1"></div>
          <div className=" flex gap-3 w-fit ml-auto">
            <button
              onClick={onClose}
              className=" border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition ease-in-out duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition ease-in-out duration-150"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetails;
