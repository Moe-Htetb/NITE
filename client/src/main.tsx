import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router";
import router from "./Routes/router";
import { Provider } from "react-redux";

import { Toaster } from "sonner";
import store from "./store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors={true} />
    </Provider>
  </StrictMode>
);
