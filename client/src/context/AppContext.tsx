import mockApi from "@/assets/mockApi";
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

const AppContext = createContext(initialState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isUserFetched, setIsUserFetched] = useState<boolean>(false);
  const [onboardingCompleted, setOnboardingCompleted] =
    useState<boolean>(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  const signup = async (credentials: Credentials) => {
    console.log(credentials);
    const { data } = await mockApi.auth.register(credentials);
    setUser(data.user);
    if (data?.user.age && data?.user?.weight && data?.user?.goal) {
      setOnboardingCompleted(true);
    }
    localStorage.setItem("token", data.jwt);
  };
  const login = async (credentials: Credentials) => {
    console.log(credentials);
    const { data } = await mockApi.auth.login(credentials);
    setUser({ ...data.user, token: data.jwt });
    if (data?.user.age && data?.user?.weight && data?.user?.goal) {
      setOnboardingCompleted(true);
    }
    localStorage.setItem("token", data.jwt);
  };
  const fetchUser = async (token: string) => {
    const { data } = await mockApi.user.me();
    setUser({ ...data, token });
    if (data?.age && data?.weight && data?.goal) {
      setOnboardingCompleted(true);
    }
    setIsUserFetched(true);
  };
  const fetchFoodLogs = async () => {
    const { data } = await mockApi.foodLogs.list();
    setAllFoodLogs(data);
  };
  const fetchActivityLogs = async () => {
    const { data } = await mockApi.activityLogs.list();
    setAllActivityLogs(data);
  };
  const logout = async () => {
    setUser(null);
    setOnboardingCompleted(false);
    setAllFoodLogs([]);
    setAllActivityLogs([]);
    localStorage.removeItem("token");
    navigate("/");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        await fetchUser(token);
        await fetchFoodLogs();
        await fetchActivityLogs();
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
