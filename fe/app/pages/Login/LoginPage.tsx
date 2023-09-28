"use client";

import { Dispatch, useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { redirect } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/app/utils/Firebase";
import usePageTitle from "@/app/hooks/usePageTitle";
import LoadingScreen from "@/app/components/LoadingScreen/LoadingScreen";

export default function LoginPage() {
  usePageTitle("Authentication");

  const [user, setUser]: [any, Dispatch<any>] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isAuthenticated = !!user;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authState, setAuthState] = useState(isAuthenticated);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (authState) {
      redirect("/");
    }
  });

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
    setAuthError("");
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
    setAuthError("");
  };

  const handleLogin = () => {
    if (!email || !password)
      return setAuthError("Please enter email and password");

    if (!email.includes("@") || !email.includes("."))
      return setAuthError("Invalid email");

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setAuthState(true);
      })
      .catch(() => {
        setAuthError("Invalid email or password");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRegister = () => {
    if (!email || !password)
      return setAuthError("Please enter email and password");

    if (!email.includes("@") || !email.includes("."))
      return setAuthError("Invalid email");

    if (password.length < 6)
      return setAuthError("Password too short, must be at least 6 characters");

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setAuthState(true);
      })
      .catch(() => {
        setAuthError("Cannot register user");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {(loading && <LoadingScreen />) || (
        <div className="flex justify-content-center align-items-center h-[80vh]">
          <Card
            title="Authentication"
            className="md:w-25rem shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>

            {authError && (
              <div className="field">
                <label className="text-red-500">{authError}</label>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                style={{ borderRadius: 0 }}
                label="Sign In"
                onClick={handleLogin}
              />

              <Button
                style={{ borderRadius: 0 }}
                label="Register"
                onClick={handleRegister}
                severity="help"
              />
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
