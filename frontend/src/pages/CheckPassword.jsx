import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyPassword } from "../redux/actions.js/userAction";
import { Bounce, toast } from "react-toastify";
import { clearVeriyPasswordError } from "../redux/reducer.js/userReducer";
import Avatar from "../components/user/Avatar";
const CheckPassword = () => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { error, success, message } = useSelector((state) => state.user);
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      verifyPassword({
        password,
        userId: location.state?._id,
      })
    );
    setPassword("");
  };
  useEffect(() => {
    if (error) {
      toast.error(message, {
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
      toast.success(`${message}✓`, {
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
      navigate("/");
    }
    if (!location.state?._id) {
      navigate("/email");
    }
    dispatch(clearVeriyPasswordError());
  }, [dispatch, error, message, navigate]);

  return (
    <div className="mt-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden mx-auto animate-fade-in-down p-6">
        <div className=" flex justify-center mb-6">
          <div className="bg-white flex flex-col items-center justify-center p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl">
            <Avatar
              image={location.state?.avatar?.url}
              className=" h-32 w-32 object-cover border-4 border-gray-300  mb-4 hover:border-gray-500"
            />
            <p className="text-lg font-semibold text-gray-800">
              {location.state?.name}
            </p>
            <p className="text-sm text-gray-500">{location.state?.emai}</p>
          </div>
        </div>

        <form className="grid gap-6 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700" htmlFor="password">
              Password :
            </label>
            <input
              type="password"
              id="password"
              placeholder="enter your password"
              className="bg-slate-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="bg-indigo-600 text-lg px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white font-bold transition duration-300 ease-in-out">
            login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          <Link
            to={"/forgot-password"}
            className="hover:text-indigo-500 font-semibold transition duration-300 ease-in-out"
          >
            Forgot password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPassword;
