import api from "@/config/api";
import {
  initialState,
  type ActivityEntry,
  type AppContextType,
  type Credentials,
  type FoodEntry,
  type User,
} from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AppContext = createContext(initialState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isUserFetched, setIsUserFetched] = useState<boolean>(
    localStorage.getItem("token") ? false : true,
  );
  const [onboardingCompleted, setOnboardingCompleted] =
    useState<boolean>(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  const signup = async (credentials: Credentials) => {
    try {
      const { data } = await api.post("/api/auth/local/register", credentials);
      setUser({ ...data.user, token: data.jwt });
      if (data?.user.age && data?.user?.weight && data?.user?.goal) {
        setOnboardingCompleted(true);
      }
      localStorage.setItem("token", data.jwt);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };
  const login = async (credentials: Credentials) => {
    try {
      const { data } = await api.post("/api/auth/local", {
        identifier: credentials.email,
        password: credentials.password,
      });
      setUser({ ...data.user, token: data.jwt });
      if (data?.user.age && data?.user?.weight && data?.user?.goal) {
        setOnboardingCompleted(true);
      }
      localStorage.setItem("token", data.jwt);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.jwt}`;
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };
  const fetchUser = async (token: string) => {
    try {
      const { data } = await api.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser({ ...data, token });
      if (data?.age && data?.weight && data?.goal) {
        setOnboardingCompleted(true);
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
    setIsUserFetched(true);
  };
  const fetchFoodLogs = async (token: string) => {
    try {
      const { data } = await api.get("/api/food-logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllFoodLogs(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };
  const fetchActivityLogs = async (token: string) => {
    try {
      const { data } = await api.get("/api/activity-logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllActivityLogs(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };
  const logout = async () => {
    setUser(null);
    setOnboardingCompleted(false);
    setAllFoodLogs([]);
    setAllActivityLogs([]);
    api.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem("token");
    navigate("/");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        await fetchUser(token);
        await fetchFoodLogs(token);
        await fetchActivityLogs(token);
      })();
    } else {
      setIsUserFetched(true);
    }
  }, []);

  const value: AppContextType = {
    user,
    setUser,
    isUserFetched,
    fetchUser,
    signup,
    login,
    logout,
    onboardingCompleted,
    setOnboardingCompleted,
    allFoodLogs,
    allActivityLogs,
    setAllActivityLogs,
    setAllFoodLogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
