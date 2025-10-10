import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SocketContext } from "../socket/socketContext.jsx";
import "../App.css";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { BsEmojiSmile } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { MdOutlineCancelPresentation } from "react-icons/md";
import backgroundImage from "../assets/chatBackground.jpg";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { VscSend } from "react-icons/vsc";
import { useSelector } from "react-redux";
import axios, { all } from "axios";
import moment from "moment";
import { BACKEND_URL_PROD } from "../constant.js";
import Avatar from "./user/Avatar.jsx";
import { RiCheckDoubleLine } from "react-icons/ri";
const MessagePage = () => {
  const { user } = useSelector((state) => state?.user);
  const { socketConnectionState, isLoading } = useContext(SocketContext);
  socketConnectionState?.on("user-status-update", (data) => {});
  const params = useParams();
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState({
    photo: "",
    video: "",
    text: "",
    preview: "",
  });
  const [allMessages, setAllMessages] = useState([]);

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dialougeRef = useRef(null);
  const previewRef = useRef(null);
  const messageRef = useRef(null);
  useEffect(() => {
    if (!isLoading && socketConnectionState === null) {
      // console.error("Socket connection not established.");
      return;
    }
    const handleMessageUser = (data) => {
      // data of user to chat with
      setUserData(data);
    };
    const handlePrevMessage = async (data) => {
      // chat new and previous conversation handler
      if (data?.length > 0) {
        const lastMessage = data[data?.length - 1];

        if (lastMessage?.senderId !== user?.user?._id && !lastMessage?.seen) {
          socketConnectionState?.emit("seen", params.userId);
        }
      }
      setAllMessages(data);
    };
    // emit when user open the chat of user
    const handleStatusUpdate = (data) => {
      if (data?.userId === userData?._id) {
        setUserData((prev) => ({
          ...prev,
          online: data.online,
          lastSeen: data.lastSeen,
        }));
      }
    };
    const handleSeenStatus = ({ messageIds }) => {
      setAllMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
        )
      );
    };
    if (socketConnectionState) {
      // remove the previous event listensers
      socketConnectionState?.off("message-user", handleMessageUser);
      socketConnectionState?.off("message", handlePrevMessage);
      socketConnectionState?.off("user-status-update", handleStatusUpdate);
      socketConnectionState?.off("seen-status", handleSeenStatus);
      // cleaned
      socketConnectionState?.on("message-user", handleMessageUser);
      socketConnectionState?.on("message", handlePrevMessage);
      socketConnectionState?.on("seen-status", handleSeenStatus);
      // Emit Once
      socketConnectionState?.emit("message-page", params.userId);
    }
    setMessage({
      photo: "",
      video: "",
      text: "",
      preview: "",
    });

    return () => {
      socketConnectionState?.off("message-user", handleMessageUser);
      socketConnectionState?.off("message", handlePrevMessage);
      socketConnectionState?.off("user-status-update", handleStatusUpdate);
      socketConnectionState?.off("seen-status", handleSeenStatus);
    };
  }, [socketConnectionState, params.userId, isLoading, user]);
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allMessages, messageRef]);
  const handleMediaLoaded = () => {
    setUploading(false);
    messageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };
  const validateLastSeenDate = (lastSeenDateStr) => {
    const dateParts = lastSeenDateStr
      ?.split(" ")
      .filter(
        (part) =>
          ![
            "at",
            "Tuesday",
            "Monday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].includes(part)
      )
      .join(" ");
    const lastSeenDate = new Date(dateParts);
    return lastSeenDate;
  };
  console.log(allMessages, "all messages");
  console.log(user?.user?._id, "id");
  const formatLastSeen = (lastSeenDateStr) => {
    const now = new Date();
    const lastSeenDate = validateLastSeenDate(lastSeenDateStr);
    const time = lastSeenDate.toLocaleTimeString("en-In", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    // check if last seen is Today
    if (now.toDateString() === lastSeenDate.toDateString())
      return `Today ${time}`;
    // check if last seen is Yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (yesterday.getDate() === lastSeenDate.toDateString())
      return `Yesterday ${time}`;
    // check if last seen is earlier this week
    const dayDiffernce = Math.floor(now - lastSeenDate) / (1000 * 60 * 60 * 24);
    if (dayDiffernce < 7) {
      const dayofweek = lastSeenDate.toLocaleDateString("en-In", {
        weekday: "long",
      });
      return `${dayofweek} ${time}`;
    }
    const formatedDate = lastSeenDate.toLocaleDateString("en-In", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    return `${formatedDate} ${time}`;
  };

  const handleImageVideoDialogueBox = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };
  const handleChange = async (e) => {
    if (e.target.name === "media") {
      const file = e.target.files[0];

      if (!file) return;
      const fileType = file.type.includes("image/")
        ? "photo"
        : file.type.includes("video/")
        ? "video"
        : null;
      if (!fileType)
        return alert("Unsupported file type! Please upload an image or video.");
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize)
        return alert(
          "file size to large! please upload an file smaller than 5 mb."
        );
      const reader = new FileReader();
      reader.onload = () => {
        setMessage((prev) => ({
          ...prev,
          [fileType]: file,
          preview: reader.result,
        }));

        handleImageVideoDialogueBox(false);
      };
      reader.onerror = () => {
        console.error("faild to read file.");
        alert("fail to read file! please try again.");
      };
      reader.readAsDataURL(file);
    } else {
      setMessage((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!socketConnectionState) {
      console.error("Socket connection not established.");
      return;
    }
    if (!message?.text?.trim() && !message?.photo && !message?.video) return;
    setUploading(true);
    const tempMessage = {
      text: message?.text,
      video: message?.video,
      photo: message?.photo,
    };
    setMessage({ text: "", photo: "", video: "", preview: "" });
    try {
      let fileType = "";
      let mediaUrl = "";
      if (tempMessage?.photo || tempMessage?.video) {
        fileType = tempMessage?.photo ? "photo" : "video";
        const formData = new FormData();
        formData.append("file", tempMessage[fileType]);
        const config = {
          headers: {
            "Contend-Type": "multipart/form-data",
            withCredentials: true,
          },
        };
        const response = await axios.post(
          `${BACKEND_URL_PROD}/chat-media`,
          formData,
          config
        );
        mediaUrl = response?.data?.url;
      }
      socketConnectionState?.emit("new-message", {
        sender: user?.user?._id,
        receiver: params.userId,
        text: tempMessage?.text || "",
        [fileType]: mediaUrl || "",
      });
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClose = () => {
    setMessage((prev) => () => ({
      ...prev,
      preview: "",
    }));
  };
  const handleClickOutside = (e) => {
    if (dialougeRef.current && !dialougeRef.current.contains(e.target)) {
      setOpenImageVideoUpload(false);
    }
    if (
      previewRef.current &&
      !previewRef.current.contains(e.target) &&
      !e.target.closest("form") &&
      message.preview
    ) {
      const discard = window.confirm("discard changes ?");
      if (discard) {
        setMessage({ photo: "", video: "", preview: "" });
      }
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [message.preview]);
  // useEffect(() => {
  //   if (socketConnectionState) {
  //   }
  // }, [dialougeRef, , socketConnectionState]);
  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex px-4 justify-between items-center">
        <div className="flex items-center gap-4 lg:w-[30%] sm:w-[50%]">
          <Link to="/" className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>
          <div className="flex gap-3 p-1">
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm flex justify-center items-center bg-gray-100">
              <Avatar
                image={userData?.profile_pic}
                className="border-2 border-gray-100 h-full w-full object-cover"
                alt={userData?.name}
              />
            </div>
            <div>
              <p className=" mt-1 text-gray-500 font-semibold">
                {userData?.name} {user?.user?._id === params.userId && "(Self)"}
              </p>
              <p className="text-gray-300 font-medium ">
                {userData?.lastSeen
                  ? formatLastSeen(userData?.lastSeen)
                  : "Online"}
              </p>
            </div>
          </div>
        </div>
        <div>
          <button className="outline-none hover:text-primary cursor-pointer">
            <HiDotsVertical size={20} />
          </button>
        </div>
      </header>

      <section
        className={`h-[calc(100vh-115px)] pb-2 overflow-x-hidden   ${
          message.preview ? "overflow-hidden sticky" : "overflow-y-scroll"
        } scrollbar  bg-slate-200 bg-opacity-20`}
      >
        {/* all messages shows here  */}
        <div className=" h-full  overflow-y-scroll overflow-x-hidden scrollbar ml-5 ">
          <div className="h-[calc(100vh-165px)]"></div>
          {allMessages.map((mess, indx) => {
            return (
              <div
                ref={messageRef}
                key={indx}
                className={`relative  w-fit min-w-[50px] max-w-[500px]  break-words flex flex-col justify-center items-center p-2     mt-2 shadow-md  ${
                  mess?.senderId === user?.user?._id
                    ? " bg-teal-100 ml-auto mr-2 rounded-tl-lg rounded-bl-lg rounded-tr-lg"
                    : "bg-gray-300 rounded-br-lg rounded-tr-lg rounded-tl-lg"
                }`}
              >
                {/* {uploading && (
                  <div className="h-[250px] w-[300px]">
                    <Loading />
                  </div>
                )} */}
                {mess?.imageUrl && mess?.imageUrl !== "default_image_url" && (
                  <div className=" relative">
                    <div className="max-w-[300px] max-h-[250px] overflow-hidden flex items-center">
                      <img
                        src={mess?.imageUrl}
                        alt="media"
                        onLoad={handleMediaLoaded}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div>
                      {mess?.text ? (
                        <div>
                          <p className="max-w-[300px] break-words mt-1">
                            {mess?.text}
                          </p>
                          <p className=" absolute text-[8px] bottom-0 right-2 ">
                            {moment(mess?.createdAt).format("h:mm A")}
                          </p>
                        </div>
                      ) : (
                        <p className=" absolute text-[8px] bottom-1 right-2 bg-opacity-30  bg-black text-white rounded py-0.5 px-0.5">
                          {moment(mess?.createdAt).format("h:mm A")}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {mess?.videoUrl && mess?.videoUrl !== "default_video_url" && (
                  <div className=" relative">
                    <div className="max-w-[300px] max-h-[250px] overflow-hidden  flex flex-col items-center">
                      <video
                        src={mess?.videoUrl}
                        alt="media"
                        className="h-full w-full object-cover object-center"
                        controls
                        onLoad={handleMediaLoaded}
                      />
                    </div>
                    <div>
                      {mess?.text ? (
                        <div>
                          <p className="max-w-[300px] break-words mt-1">
                            {mess?.text}
                          </p>
                          <p className=" absolute text-[8px] bottom-0 right-2 ">
                            {moment(mess?.createdAt).format("h:mm A")}
                          </p>
                        </div>
                      ) : (
                        <p className=" absolute text-[8px] bottom-1 right-2 bg-opacity-30  bg-black text-white rounded py-0.5 px-0.5">
                          {moment(mess?.createdAt).format("h:mm A")}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {mess?.text &&
                  mess?.imageUrl === "default_image_url" &&
                  mess?.videoUrl === "default_video_url" && (
                    <div className="flex items-end justify-between relative">
                      <p className="mr-4  ">{mess?.text}</p>
                      <div className=" box-border">
                        <p className="text-[8px] whitespace-nowrap">
                          {moment(mess?.createdAt).format("h:mm A")}
                        </p>
                        {mess?.senderId === user?.user?._id && (
                          <span
                            className={`${
                              mess.seen || mess?.senderId === params.userId
                                ? "text-blue-700"
                                : ""
                            } relative left-[13px] top-[5px]`}
                          >
                            <RiCheckDoubleLine />
                          </span>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
        {/* upload Image display */}
        {message.preview && (
          <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-300 z-50">
            <div
              ref={previewRef}
              className=" p-3 sticky left-2 bottom-0 
  bg-slate-300 overflow-hidden rounded-lg 
  w-full h-[300px] 
  sm:w-full sm:h-full 
  md:w-[500px] md:h-[400px] 
  lg:w-[600px] lg:h-[480px]"
            >
              <div
                className="w-fit absolute top-0 right-0 p-2 text-primary hover:text-gray-500 cursor-pointer z-40"
                onClick={handleUploadClose}
              >
                <MdOutlineCancelPresentation size={30} />
              </div>
              {message.photo ? (
                <img
                  src={message?.preview || ""}
                  alt="upload image"
                  className="h-full w-full object-contain"
                />
              ) : (
                <video
                  src={message?.preview || ""}
                  controls
                  muted
                  autoPlay
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </div>
        )}
      </section>

      <section className="h-12 bg-white border-2 border-gray-300 rounded px-4 flex items-center">
        <div className="flex w-full h-full items-center gap-3 ">
          <button className="text-gray-400 w-8 h-8 outline-none  flex justify-center items-center rounded-full shadow-md hover:text-gray-700 hover:bg-gray-300">
            <BsEmojiSmile size={25} />
          </button>
          <button
            ref={dialougeRef}
            onClick={handleImageVideoDialogueBox}
            className="text-gray-400 w-8 h-8  flex justify-center outline-none items-center rounded-full shadow-md hover:text-gray-700 hover:bg-gray-300"
          >
            <FaPlus size={25} />
          </button>

          {/* image , document, video etc dialogue box  */}

          {openImageVideoUpload && (
            <div
              className="bg-white absolute bottom-16 shadow w-36 p-2 rounded"
              ref={dialougeRef}
            >
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex p-2 px-3 gap-3 hover:bg-slate-200 items-center cursor-pointer rounded-full"
                >
                  <div className=" text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex p-2 px-3 gap-3 hover:bg-slate-200 items-center cursor-pointer rounded-full"
                >
                  <div className=" text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>video</p>
                </label>
                <input
                  type="file"
                  name="media"
                  accept="image/*"
                  id="uploadImage"
                  onChange={handleChange}
                  className="hidden"
                />
                <input
                  type="file"
                  name="media"
                  accept="video/*"
                  id="uploadVideo"
                  onChange={handleChange}
                  className=" hidden"
                />
              </form>
            </div>
          )}
          {/* input box for text messages */}
          <form
            className="w-full h-full flex gap-3 m-3 p-1 py-1"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              name="text"
              className=" w-full outline-none"
              placeholder="Type here message..."
              value={message?.text || ""}
              onChange={handleChange}
            />
            <button
              className="text-primary hover:text-green-800 outline-none"
              type="submit"
            >
              <VscSend size={25} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
export default MessagePage;
