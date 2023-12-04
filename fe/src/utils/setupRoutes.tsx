import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import HomePage from "../pages/Home/HomePage.tsx";
import LoginPage from "../pages/Login/LoginPage.tsx";
import WebsitesPage from "../pages/Websites/WebsitesPage.tsx";
import ConfigPage from "../pages/Config/ConfigPage.tsx";

export function setupRoutes() {
  return createBrowserRouter([
    {
      element: <App />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/websites",
          element: <WebsitesPage />,
        },
        {
          path: "/config",
          element: <ConfigPage />,
        },
      ],
    },
    {
      path: "*",
      element: <div>404</div>,
    },
  ]);
}
