import { ComponentType, useEffect, useState } from "react";
import { firebaseApp } from "../utils/Firebase";
import { getAuth } from "firebase/auth";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import { useNavigate } from "react-router-dom";

export default function withAuth(WrappedComponent: ComponentType<unknown>) {
  return function ComponentWithAuth(props: Record<string, unknown>) {
    const [authenticated, setAuthenticated] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
      const unsubscribe = getAuth(firebaseApp).onAuthStateChanged((user) => {
        if (user) {
          setAuthenticated(true);
        } else {
          return navigate("/login");
        }
      });

      return () => unsubscribe();
    }, [navigate]);

    if (!authenticated) {
      return (
        <>
          <LoadingScreen />
        </>
      );
    }

    return (
      <div className="pb-[160px]">
        <WrappedComponent {...props} />
      </div>
    );
  };
}
