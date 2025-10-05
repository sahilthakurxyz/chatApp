import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  user: {},
  error: false,
  message: null,
  success: false,
  data: {},
  onlineUser: [],
  socketConnection: null,
};
const userSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    registerRequest: (state) => {
      state.loading = true;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.success = action.payload.success;
    },
    registerFail: (state, action) => {
      state.message = action.payload.message;
      state.loading = false;
      state.error = action.payload.error;
    },
    clearRegisterError: (state) => {
      state.error = false;
      state.message = null;
      state.success = false;
    },
    veriyEmailRequest: (state) => {
      state.loading = true;
    },
    veriyEmailSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.data = action.payload.data;
      state.success = action.payload.success;
    },
    veriyEmailFail: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.error = action.payload.error;
    },
    clearVeriyEmailError: (state) => {
      state.error = false;
      state.message = null;
      state.success = false;
    },
    logoutSuccess: (state, action) => {
      state.data = {};
      state.message = action.payload.message;
      state.success = action.payload.success;
      state.user = {};
      localStorage.setItem("auth", false);
      localStorage.removeItem("token");
      state.socketConnection = null;
    },
    logoutFail: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    },
    verifyPasswordRequest: (state) => {
      state.loading = true;
    },
    verifyPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.success = action.payload.success;
      localStorage.setItem("auth", true);
      localStorage.setItem("token", action.payload?.token);
    },
    verifyPasswordFail: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
      state.message = action.payload.message;
    },
    clearVeriyPasswordError: (state) => {
      state.error = false;
      state.message = null;
      state.success = false;
    },
    loadUserRequest: (state) => {
      state.loading = true;
    },
    loadUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    loadUserFail: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      localStorage.setItem("auth", false);
      localStorage.removeItem("token");
      state.error = true;
    },
    clearLoadUserError: (state) => {
      state.message = null;
    },
    updateUserRequest: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
    },
    updateUserFail: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = true;
      state.message = action.payload.message;
    },
    resetUpdateUser: (state) => {
      state.success = false;
      state.message = null;
      state.error = false;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

const searchSlice = createSlice({
  name: "search user",
  initialState: {
    loading: false,
    users: [],
    success: false,
  },
  reducers: {
    searchUserRequest: (state) => {
      state.loading = true;
    },
    searchUserSuccess: (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.users = action.payload.user;
    },
    searchUserFail: (state) => {
      state.loading = false;
    },
    resetSearchUser: (state) => {
      state.users = [];
      state.success = false;
    },
  },
});

export const userReducer = userSlice.reducer;
export const {
  registerRequest,
  registerSuccess,
  registerFail,
  clearRegisterError,
  logoutSuccess,
  logoutFail,
  veriyEmailRequest,
  veriyEmailSuccess,
  veriyEmailFail,
  clearVeriyEmailError,
  verifyPasswordRequest,
  verifyPasswordSuccess,
  verifyPasswordFail,
  clearVeriyPasswordError,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  clearLoadUserError,
  updateUserRequest,
  updateUserSuccess,
  updateUserFail,
  resetUpdateUser,
  setOnlineUser,
  setSocketConnection,
} = userSlice.actions;

export const searchReducer = searchSlice.reducer;
export const {
  searchUserRequest,
  searchUserSuccess,
  searchUserFail,
  resetSearchUser,
} = searchSlice.actions;
