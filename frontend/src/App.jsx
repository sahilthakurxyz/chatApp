import { Fragment, useContext, useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketContext } from "./socket/socketContext";
// import { SocketContext } from "../socket/socketContext";
export const emitLastSeen = (socketConnectionState) => {
  if (socketConnectionState) {
    const date = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/kolkata",
      dateStyle: "full",
      timeStyle: "medium",
    }).format(new Date());
    const yearMonthDayTime = date.split(" ");
    socketConnectionState.emit("last-seen", yearMonthDayTime);
  }
};
function App() {
  const { socketConnectionState } = useContext(SocketContext);

  useEffect(() => {
    const handleVisibilityChange = () => {
      emitLastSeen(socketConnectionState);
    };

    if (socketConnectionState) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [socketConnectionState]);
  return (
    <Fragment>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
}

export default App;
