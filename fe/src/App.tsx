import { Outlet, ScrollRestoration } from "react-router-dom";
import RootLayout from "./layout.tsx";

export default function App() {
  return (
    <>
      <ScrollRestoration />

      <RootLayout>
        <Outlet />
      </RootLayout>
    </>
  );
}
