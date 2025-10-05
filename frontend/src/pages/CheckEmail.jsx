import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { verifyEmail } from "../redux/actions.js/userAction";
import { Bounce, toast } from "react-toastify";
import { clearVeriyEmailError } from "../redux/reducer.js/userReducer";

export const CheckEmail = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();
  const { message, loading, error, success, data } = useSelector(
    (state) => state.user
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
    dispatch(verifyEmail(email));
    setAlert(true);
  };
  const alertError = (error) => {
    if (error && alert) {
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
  };
  useEffect(() => {
    alertError(error);
    if (success) {
      toast.success(`${message}✓⃝`, {
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
      navigate("/password", { state: data });
    }
    dispatch(clearVeriyEmailError());
  }, [error, dispatch, success, message, navigate]);
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2">
          <MdEmail size={80} color="#5246d4" />
        </div>

        <h3 className=" font-sans font-semibold">
          vault Chat verify your Email
        </h3>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Next
          </button>
        </form>

        <p className="my-3 text-center">
          New User ?
          <Link to={"/register"} className="hover:text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
