import { ComponentType, useEffect, useState } from "react";
import { firebaseApp } from "@/app/utils/Firebase";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/app/components/LoadingScreen/LoadingScreen";

export default function withAuth(WrappedComponent: ComponentType<any>) {
  return function ComponentWithAuth(props: any) {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
      const unsubscribe = getAuth(firebaseApp).onAuthStateChanged((user) => {
        if (user) {
          setAuthenticated(true);
        } else {
          router.push("/login");
        }
      });

      return () => unsubscribe();
    }, [router]);

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
