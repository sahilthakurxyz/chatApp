import { thunk } from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { searchReducer, userReducer } from "../reducer.js/userReducer";
export const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
