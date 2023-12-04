import "./index.scss";
import Navbar from "./components/Navbar/Navbar";

//theme
import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";

//core
import "primereact/resources/primereact.min.css";

// primeflex
import "primeflex/primeflex.css";

//icons
import "primeicons/primeicons.css";
import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/Firebase";
import usePageTitle from "./hooks/usePageTitle";
import { ToastProvider } from "./context/ToastContext";
import { PrimeReactProvider } from "primereact/api";

export default function RootLayout({ children }: { children: ReactNode }) {
  usePageTitle("App");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <PrimeReactProvider>
        {isLoggedIn && <Navbar />}

        <ToastProvider>
          <div className="container mx-auto p-5">{children}</div>
        </ToastProvider>
      </PrimeReactProvider>
    </>
  );
}
