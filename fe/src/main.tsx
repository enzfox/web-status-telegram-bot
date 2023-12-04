import React from "react";
import ReactDOM from "react-dom/client";
import { setupRoutes } from "./utils/setupRoutes.tsx";
import { RouterProvider } from "react-router-dom";

const router = setupRoutes();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
