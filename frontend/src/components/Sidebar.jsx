import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";
import { FaUserPlus } from "react-icons/fa6";
import { BiLeftArrow, BiLogOut } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails.jsx";
import { logout } from "../redux/actions.js/userAction.js";
import { FiArrowUpLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import SearchUser from "./SearchUser.jsx";
import { SocketContext } from "../socket/socketContext.jsx";
import Avatar from "./user/Avatar.jsx";
import { IoImagesOutline } from "react-icons/io5";
import { BsCameraVideo } from "react-icons/bs";

const Sidebar = () => {
  const dispatch = useDispatch();
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  const navigate = useNavigate();
  // const isOnline = onlineUser.includes(user.user?._id);
  const { setSocketConnectionState, socketConnectionState } =
    useContext(SocketContext);
  useEffect(() => {
    if (!socketConnectionState) {
      return;
    }
    const handleConversationUser = (data) => {
      const getConversation = data?.map((conversationUser) => {
        if (conversationUser?.receiver?._id !== user?.user?._id) {
          return {
            ...conversationUser,
            userDetails: conversationUser?.receiver,
          };
        } else {
          return {
            ...conversationUser,
            userDetails: conversationUser?.sender,
          };
        }
      });

      setAllUser(getConversation);
    };
    socketConnectionState?.emit("sidebar", user?.user?._id);
    socketConnectionState?.on("conversation", handleConversationUser);
    return () => {
      socketConnectionState?.off("conversation", handleConversationUser);
    };
  }, [socketConnectionState, user]);
  const handleLogout = () => {
    if (socketConnectionState) {
      // emitLastSeen(socketConnectionState);
      socketConnectionState?.emit("update-last-seen", new Date().toISOString());
      socketConnectionState.disconnect();
    }
    setSocketConnectionState(null);
    dispatch(logout());
    navigate("/email");
  };
  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-800 flex flex-col justify-between">
        <div>
          <NavLink
            title="chat"
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-300 ${
                isActive && "bg-slate-200"
              }`
            }
          >
            <AiOutlineMessage height={80} width={50} />
          </NavLink>
          <div
            onClick={() => setOpenSearchUser(true)}
            title="add friend"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded'"
          >
            <FaUserPlus />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="hover:bg-slate-300 w-12 h-12 flex justify-center items-center box-border pt-3 relative">
            <button
              className=" border-none outline-none"
              onClick={() => setEditUserOpen(true)}
            >
              <Avatar
                className="h-6 w-6 mb-4 border-2 border-gray-300  hover:border-3"
                image={user?.user?.avatar?.url}
              />
            </button>
            <div className=" h-2 w-2 bg-green-600 absolute top-7 right-3 rounded-full"></div>
          </div>
          <button
            onClick={handleLogout}
            className="border-none outline-none w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>
      <div className=" w-full">
        <div className=" h-16 flex items-center">
          <h2 className=" text-xl font-semibold p-4 text-slate-800">Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>
        <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <motion.div
              className="mt-12 p-6 rounded-lg shadow bg-white bg-opacity-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex justify-center items-center my-4 text-slate-500">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0],
                    transition: { repeat: Infinity, duration: 2 },
                  }}
                >
                  <FiArrowUpLeft size={30} className="text-indigo-500" />
                </motion.div>
              </div>
              <p
                className="text-lg text-center text-indigo-200 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Search a user to start conversation
              </p>
            </motion.div>
          )}
          {allUser?.map((sidebarUser, idx) => {
            return (
              <NavLink
                to={`/${sidebarUser?.userDetails?._id}`}
                key={sidebarUser?._id}
                className="flex items-center border-b gap-2 hover:bg-slate-100"
              >
                <div className=" p-2 flex-shrink-0 ">
                  <Avatar
                    image={sidebarUser?.userDetails?.avatar?.url}
                    className="w-10 h-10 object-cover"
                    alt={sidebarUser?.userDetails?.name}
                  />
                </div>
                <div className="flex flex-col justify-evenly">
                  <p className="font-medium text-sm text-gray-700 text-ellipsis line-clamp-1">
                    {sidebarUser?.userDetails?.name}
                  </p>
                  <div className="flex text-slate-500 text-sm ">
                    <div>
                      {sidebarUser?.lastMsg?.imageUrl &&
                        sidebarUser?.lastMsg?.imageUrl !==
                          "default_image_url" && (
                          <div className="flex items-center gap-2">
                            <span>
                              <IoImagesOutline />
                            </span>
                            {!sidebarUser?.lastMsg?.text ? (
                              "Image"
                            ) : (
                              <p className="text-ellipsis line-clamp-1">
                                {sidebarUser?.lastMsg?.text}
                              </p>
                            )}
                          </div>
                        )}
                      {sidebarUser?.lastMsg?.videoUrl &&
                        sidebarUser?.lastMsg?.videoUrl !==
                          "default_video_url" && (
                          <div className="flex items-center gap-2">
                            <span>
                              <BsCameraVideo />
                            </span>
                            {!sidebarUser?.lastMsg?.text ? (
                              "Video"
                            ) : (
                              <p className="text-ellipsis line-clamp-1">
                                {sidebarUser?.lastMsg?.text}
                              </p>
                            )}
                          </div>
                        )}
                    </div>
                    <div className="text-ellipsis line-clamp-1">
                      {sidebarUser?.lastMsg?.imageUrl === "default_image_url" &&
                        sidebarUser?.lastMsg?.videoUrl ===
                          "default_video_url" && (
                          <p>{sidebarUser?.lastMsg?.text}</p>
                        )}
                    </div>
                  </div>
                </div>
                {Boolean(sidebarUser?.unseenMsg) && (
                  <p className="bg-green-600 p-1 mt-5 rounded-full h-4 w-4 ml-auto mr-1 text-[9px] flex items-center justify-center text-white flex-shrink-0">
                    {sidebarUser?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
      {/* Edit User Profile */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}
      {/* Open Search User */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
