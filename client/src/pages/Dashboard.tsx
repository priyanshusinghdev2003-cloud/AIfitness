import { getMotivationalMessage } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import type { ActivityEntry, FoodEntry } from "@/types";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user, allActivityLogs, allFoodLogs } = useAppContext();
  const [todayFoodLog, setTodayFoodLog] = useState<FoodEntry[]>([]);
  const [todayActivities, setTodayActivities] = useState<ActivityEntry[]>([]);

  const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000;
  const loadUserData = () => {
    const today = new Date().toISOString().split("T")[0];
    const foodData = allFoodLogs.filter(
      (log: FoodEntry) => log.createdAt?.split("T")[0] === today,
    );
    const activityData = allActivityLogs.filter(
      (log: ActivityEntry) => log.createdAt?.split("T")[0] === today,
    );
    setTodayFoodLog(foodData);
    setTodayActivities(activityData);
  };
  useEffect(() => {
    (() => {
      loadUserData();
    })();
  }, [allActivityLogs, allFoodLogs]);
  const totalCalories: number = todayFoodLog.reduce(
    (total, food) => total + food.calories,
    0,
  );
  const remainingCalories: number = DAILY_CALORIE_LIMIT - totalCalories;
  const totalActiveMinutes: number = todayActivities.reduce(
    (total, activity) => total + activity.duration,
    0,
  );
  const totalCaloriesBurned: number = todayActivities.reduce(
    (total, activity) => total + (activity.calories || 0),
    0,
  );
  const motivation = getMotivationalMessage(
    totalCalories,
    totalActiveMinutes,
    DAILY_CALORIE_LIMIT,
  );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="header relative h-72 w-full bg-linear-to-l from-card to-transparent z-1 shadow-sm shadow-black/20 rounded-md flex flex-col justify-center px-4">
        <h1 className=" font-bold text-sm text-muted-foreground">
          Welcome back,
        </h1>
        <div className="text-2xl font-bold text-primary mt-2">
          Hi there! 👋 {user?.username}
        </div>
        <div className="p-3 dark:bg-white/20 bg-black/20 backdrop-blur-sm rounded-md w-full mt-5">
          {motivation.text} {motivation.emoji}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
