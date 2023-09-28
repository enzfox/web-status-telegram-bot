"use client";

import "./globals.css";
import Navbar from "@/app/components/Navbar/Navbar";

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
import { auth } from "@/app/utils/Firebase";
import usePageTitle from "@/app/hooks/usePageTitle";
import { ToastProvider } from "@/app/context/ToastContext";

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
    <html lang="en">
      <body>
        {isLoggedIn && <Navbar />}

        <ToastProvider>
          <div className="container mx-auto p-5">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}
