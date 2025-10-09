import { Fragment, useContext, useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketContext } from "./socket/socketContext";
// import { SocketContext } from "../socket/socketContext";
// export const emitLastSeen = (socketConnectionState) => {
//   if (socketConnectionState) {
//     const date = new Intl.DateTimeFormat("en-IN", {
//       timeZone: "Asia/kolkata",
//       dateStyle: "full",
//       timeStyle: "medium",
//     }).format(new Date());
//     const yearMonthDayTime = date.split(" ");
//     socketConnectionState.emit("last-seen", yearMonthDayTime);
//   }
// };

function App() {
  const { socketConnectionState } = useContext(SocketContext);
  const socket = socketConnectionState;

  useEffect(() => {
    if (!socket?.connected) return;
    const emitLastSeen = () => {
      socket?.emit("update-last-seen", new Date().toISOString());
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        emitLastSeen();
      } else {
        socket?.emit("user-online");
      }
    };

    const handleBeforeUnload = () => {
      emitLastSeen();
    };

    const handleUnload = () => {
      emitLastSeen();
    };

    const handleOffline = () => {
      console.log("internet gone");
      emitLastSeen();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);
    window.addEventListener("offline", handleOffline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
      window.removeEventListener("offline", handleOffline);
    };
  }, [socketConnectionState?.connected]);
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
