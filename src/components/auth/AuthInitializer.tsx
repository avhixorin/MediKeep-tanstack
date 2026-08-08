import { useEffect } from "react";
import { useCurrentUser } from "#/hooks/useAuth";
import { useAuthStore } from "@/stores";

const AuthInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    setUser,
    logout,
    setLoading,
  } = useAuthStore();

  const {
    data,
    isLoading,
    isError,
  } = useCurrentUser();

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }

    if (isError) {
      logout();
      return;
    }

    if (data) {
      setUser(data);
      setLoading(false);
    }
  }, [
    data,
    isLoading,
    isError,
    setUser,
    logout,
    setLoading,
  ]);

  return <>{children}</>;
};

export default AuthInitializer;