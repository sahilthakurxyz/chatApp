import React, { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, logout } from "../redux/actions.js/userAction";

import Sidebar from "../components/Sidebar";
import {
  resetUpdateUser,
  setOnlineUser,
} from "../redux/reducer.js/userReducer";
import logo from "../assets/chat.png";
import { motion } from "framer-motion";
import { SocketContext } from "../socket/socketContext";
import { isTokenExpired } from "../constant";
const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    if (isTokenExpired(token)) {
      localStorage.setItem("auth", false);
      localStorage.removeItem("token");
      return false;
    } else {
      return localStorage.getItem("auth") === "true";
    }
  });

  const { socketConnectionState, setToken } = useContext(SocketContext);
  const { success } = useSelector((state) => state.user);
  useEffect(() => {
    setAuth(localStorage.getItem("auth"));

    if (auth === "false" || auth === false || auth === undefined) {
      navigate("/email");
      return;
    }
    dispatch(loadUser());

    dispatch(resetUpdateUser());
  }, [dispatch, navigate, location, success, auth]);
  const basePath = location.pathname === "/";
  // Socket Connection

  useEffect(() => {
    if (auth === "true") {
      setToken(localStorage.getItem("token"));
    }
  }, [auth, setToken]);
  useEffect(() => {
    if (!socketConnectionState) return;
    const handleOnlineUsers = (data) => {
      console.log("emit data of onlne userss", data);
      dispatch(setOnlineUser(data));
    };
    if (socketConnectionState) {
      socketConnectionState.on("onlineUser", handleOnlineUsers);
      return () => {
        socketConnectionState.off("onlineUser", handleOnlineUsers);
      };
    }
  }, [socketConnectionState?._id, dispatch]);
  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={` bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"} `}>
        <Outlet />
      </section>

      <motion.div
        className={`justify-center items-center hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
        initial={{ opacity: 0, y: 17 }}
        animate={{ opacity: 1, y: 15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex flex-col justify-center items-center text-white p-4 rounded-lg  bg-opacity-30 bg-white">
          <motion.img
            src={logo}
            alt="home logo"
            height={40}
            width={50}
            whileHover={{ scale: 1.1 }}
          />
          <p className=" text-teal-400 tracking-wide text-3xl font-sacramento">
            vaultChat
          </p>
          <p className=" text-1xl text-slate-500">
            Select your contact start to send messages{" "}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
