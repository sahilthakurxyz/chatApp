import { BACKEND_URL_PROD } from "../../constant";
import {
  loadUserFail,
  loadUserRequest,
  loadUserSuccess,
  logoutFail,
  logoutSuccess,
  registerFail,
  registerRequest,
  registerSuccess,
  searchUserFail,
  searchUserRequest,
  searchUserSuccess,
  updateUserFail,
  updateUserRequest,
  updateUserSuccess,
  verifyPasswordFail,
  verifyPasswordRequest,
  verifyPasswordSuccess,
  veriyEmailFail,
  veriyEmailRequest,
  veriyEmailSuccess,
} from "../reducer.js/userReducer";
import axios from "axios";
export const register = (userData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        withCredentials: true,
      },
    };
    dispatch(registerRequest());
    const data = await axios.post(
      `${BACKEND_URL_PROD}/register`,
      userData,
      config
    );
    dispatch(registerSuccess(data?.data));
  } catch (error) {
    console.log(error);
    dispatch(registerFail(error?.response?.data?.data));
  }
};

export const verifyEmail = (email) => async (dispatch) => {
  try {
    dispatch(veriyEmailRequest());
    const config = {
      "Content-Type": "application/json",
      withCredentials: true,
    };
    const data = await axios.post(
      `${BACKEND_URL_PROD}/email`,
      { email },
      config
    );
    dispatch(veriyEmailSuccess(data?.data));
  } catch (error) {
    console.log(error.response?.data?.data, "error in Verify Email Action");
    dispatch(veriyEmailFail(error?.response?.data?.data));
  }
};

export const verifyPassword = (password) => async (dispatch) => {
  try {
    dispatch(verifyPasswordRequest());
    const config = {
      "Content-Type": "application/json",
      withCredentials: true,
    };
    const data = await axios.post(
      `${BACKEND_URL_PROD}/password`,
      password,
      config
    );
    console.log(data, "data in");
    dispatch(verifyPasswordSuccess(data?.data));
  } catch (error) {
    dispatch(verifyPasswordFail(error?.response?.data));
  }
};

export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  const config = {
    "Content-Type": "application/json",
    withCredentials: true, // Not relevant for access tokens in headers
    headers: {
      Authorization: `Bearer ${token}`, // Include token in Authorization header
    },
  };
  try {
    dispatch(loadUserRequest());
    const data = await axios.get(`${BACKEND_URL_PROD}/user-detail`, config);
    dispatch(loadUserSuccess(data?.data));
  } catch (error) {
    dispatch(loadUserFail(error.response.data?.data));
  }
};
export const logout = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  const config = {
    "Content-Type": "application/json",
    withCredentials: true, // Not relevant for access tokens in headers
    headers: {
      Authorization: `Bearer ${token}`, // Include token in Authorization header
    },
  };
  try {
    const data = await axios.get(`${BACKEND_URL_PROD}/logout`, config);
    dispatch(logoutSuccess(data?.data));
  } catch (error) {
    dispatch(logoutFail(error.response.data?.data));
  }
};

export const updateUserInfo = (formData) => async (dispatch) => {
  const token = localStorage.getItem("token");
  const config = {
    "Content-Type": "application/json",
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    dispatch(updateUserRequest());
    const data = await axios.put(
      `${BACKEND_URL_PROD}/update-user`,
      formData,
      config
    );
    dispatch(updateUserSuccess(data?.data));
  } catch (error) {
    dispatch(updateUserFail(error?.response?.data?.data));
  }
};

export const searchForUser = (search) => async (dispatch) => {
  try {
    const config = {
      "Content-Type": "application/json",
      withCredentials: true,
    };
    dispatch(searchUserRequest());
    const data = await axios.post(
      `${BACKEND_URL_PROD}/search-user`,
      {
        search,
      },
      config
    );

    dispatch(searchUserSuccess(data?.data));
  } catch (error) {
    console.log(error, "error in Search User");
    dispatch(searchUserFail());
  }
};
