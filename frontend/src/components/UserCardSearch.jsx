import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "./user/Avatar";

const UserCardSearch = ({ user, onClose, search }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  const highlightmatch = (text) => {
    if (!search || !text) return text;
    const regex = new RegExp(`${search}`, "gi");
    return text.replace(
      regex,
      (match) => `<span class=" font-semibold text-secondary">${match}</span>`
    );
  };
  const isOnline = onlineUser.includes(user?._id);
  return (
    <Link
      to={"/" + user?._id}
      onClick={onClose}
      className="flex items-center  gap-3 p-2 my-4 hover:bg-slate-100 h-12 border border-transparent px-4 rounded-lg transition-all duration-300"
    >
      <div className="relative">
        <Avatar
          className="h-8 w-8 object-cover p-0.5 border-2 border-blue-300 hover:border-gray-300 hover:p-0"
          image={user?.avatar?.url}
        />
        {isOnline && (
          <div className=" h-2 w-2 bg-green-600 absolute top-6 right-0 rounded-full"></div>
        )}
      </div>
      <div className=" flex flex-col items-start mx-2">
        <div
          className="text-ellipsis text-1xl"
          dangerouslySetInnerHTML={{ __html: highlightmatch(user?.name) }}
        ></div>
        <p
          className=" text-sm text-ellipsis text-gray-300"
          dangerouslySetInnerHTML={{ __html: highlightmatch(user?.email) }}
        ></p>
      </div>
    </Link>
  );
};

export default UserCardSearch;
