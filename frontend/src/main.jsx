import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import router from "./routes/index.jsx";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js/store.js";
import { SocketProvder } from "./socket/socketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SocketProvder>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </SocketProvder>
  </Provider>
);
