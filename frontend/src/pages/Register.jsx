import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../redux/actions.js/userAction";
import { clearRegisterError } from "../redux/reducer.js/userReducer";
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
    avatarPrev: "",
  });
  const { error, message, success } = useSelector((state) => state.user);
  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setUserData({
            ...userData,
            prevProfile: reader.result,
            avatar: e.target.files[0],
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserData((previous) => {
        return {
          ...previous,
          [e.target.name]: e.target.value,
        };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", userData.name);
    myForm.set("email", userData.email);
    myForm.set("password", userData.password);
    myForm.set("avatar", userData.avatar);
    dispatch(register(myForm));
  };
  useEffect(() => {
    if (error) {
      toast.error(`${message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
    if (success) {
      toast.success(`${message}✅`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      navigate("/email");
    }
    dispatch(clearRegisterError());
  }, [error, success, dispatch, message]);
  return (
    <div className=" mt-5 bg-white w-full  max-w-md rounded overflow-hidden p-4 mx-auto">
      <h3>Welcome to vault it's chat application</h3>
      <form className=" grid gap-5 mt-5" onSubmit={handleSubmit}>
        <div className=" flex flex-col gap-1">
          <label htmlFor="name" className=" font-sans font-medium">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className=" bg-slate-100 rounded focus:outline-primary px-2 py-1"
            placeholder="Enter your Name"
            onChange={handleChange}
            value={userData.name}
            required
          />
        </div>
        <div className=" flex flex-col gap-1">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className=" bg-slate-100 rounded focus:outline-primary px-2 py-1"
            placeholder="Enter your Email"
            onChange={handleChange}
            value={userData.email}
            required
          />
        </div>
        <div className=" flex flex-col gap-1">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            className=" bg-slate-100 rounded focus:outline-primary px-2 py-1"
            placeholder="Enter your Password"
            onChange={handleChange}
            value={userData.password}
            required
          />
        </div>
        <div className=" flex flex-col gap-1">
          <label htmlFor="profile_pic">Upload Photo:</label>
          <div>
            {userData.avatarPrev && (
              <img
                src={userData.avatarPrev}
                alt="avatarPrev"
                style={{ height: "80px", width: "100px" }}
                className=" bg-slate-300 shadow-md object-contain"
              />
            )}
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              className=" bg-slate-100 rounded focus:outline-primary px-2 py-2"
              onChange={handleChange}
            />
          </div>
        </div>
        <button className="bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
          Register
        </button>
      </form>
      <p className="my-3 text-center">
        Already have account ?{" "}
        <Link to={"/email"} className="hover:text-primary font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
