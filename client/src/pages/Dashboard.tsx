import { getMotivationalMessage } from "@/assets/assets";
import Card from "@/assets/ui/Card";
import ProgressBar from "@/assets/ui/ProgressBar";
import { useAppContext } from "@/context/AppContext";
import type { ActivityEntry, FoodEntry } from "@/types";
import { FlameIcon, HamburgerIcon } from "lucide-react";
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
    <div className="min-h-screen bg-background text-foreground ">
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
      {/* main content */}
      <div className="px-4 -mt-10 space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-6 lg:max-w-4xl lg:mx-auto z-1">
        {/* calorie card */}
        <Card className="shadow-lg col-span-2 z-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <HamburgerIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div className="">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Calories Consumed
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {totalCalories}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Limit
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {DAILY_CALORIE_LIMIT}
              </p>
            </div>
          </div>
          <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT} />
          <div className="mt-4 flex justify-between items-center">
            <div
              className={`px-3 py-1.5 rounded-lg ${remainingCalories >= 0 ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400"}`}
            >
              <span className="text-sm font-medium">
                {remainingCalories >= 0
                  ? `${remainingCalories} kcal remaining`
                  : ` ${Math.abs(remainingCalories)} kcal over`}
              </span>
            </div>
            <span className="text-sm text-slate-400">
              {Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100)}%
            </span>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 my-4"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <FlameIcon className="w-6 h-6 text-orange-500" />
              </div>
              <div className="">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Calories Burned
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {totalCaloriesBurned}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Goal</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {user?.dailyCalorieBurn || 400}
              </p>
            </div>
          </div>
          <ProgressBar
            value={totalCaloriesBurned}
            max={user?.dailyCalorieBurn || 4000}
          />
        </Card>
        {/* Stats Row */}
      </div>
    </div>
  );
};

export default Dashboard;
