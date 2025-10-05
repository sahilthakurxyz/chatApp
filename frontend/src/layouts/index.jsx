import React, { Fragment } from "react";
import logo from "../assets/chat.png";
const AuthLayout = ({ children }) => {
  return (
    <Fragment>
      <header className="flex justify-center items-cente py-3 shadow-md bg-white">
        <img src={logo} alt="Logo" width={50} height={15} className="" />
        <p className=" text-teal-400 tracking-wide text-3xl font-sacramento">
          vaultChat
        </p>
      </header>
      {children}
    </Fragment>
  );
};

export default AuthLayout;
