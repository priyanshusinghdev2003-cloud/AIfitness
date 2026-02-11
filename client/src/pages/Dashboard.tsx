import { getMotivationalMessage } from "@/assets/assets";
import Card from "@/assets/ui/Card";
import ProgressBar from "@/assets/ui/ProgressBar";
import CaloriesChart from "@/components/CaloriesChart";
import { useAppContext } from "@/context/AppContext";
import type { ActivityEntry, FoodEntry } from "@/types";
import {
  ActivityIcon,
  FlameIcon,
  HamburgerIcon,
  Ruler,
  ScaleIcon,
  TrendingUpIcon,
  ZapIcon,
} from "lucide-react";
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
        <div className="dashboard-card-grid">
          {/* active minutes */}
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounnded-xl bg-blue-100 flex items-center justify-center">
                <ActivityIcon className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm text-slate-500">Active</p>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {totalActiveMinutes}
            </p>
            <p className="text-sm text-slate-400">minutes today</p>
          </Card>
          {/* activity count */}
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounnded-xl bg-blue-100 flex items-center justify-center">
                <ZapIcon className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-sm text-slate-500">Workouts</p>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {todayActivities.length}
            </p>
            <p className="text-sm text-slate-400">activities logged</p>
          </Card>
        </div>
        {/* Goal Card */}
        {user && (
          <Card className="bg-linear-to-r from-slate-900/20 to-slate-700/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Your Goal</p>
                <p className="capitalize font-semibold text-white">
                  {user.goal === "lose" && "🔥 Lose Weight"}
                  {user.goal === "gain" && "💪 Gain Weight"}
                  {user.goal === "maintain" && "⚖️ Maintain Weight"}
                </p>
              </div>
            </div>
          </Card>
        )}
        {/* body metrices card */}
        {user && user.weight && (
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-indigo-100/10 flex items-center justify-center">
                <ScaleIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Body Metrics
                </h3>
                <p className="text-sm text-slate-500 dark:text-white">
                  Your stats
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <ScaleIcon className="w-4 h-4 text-slate-500" />
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Weight
                  </span>
                </div>
                <span className=" text-slate-800 dark:text-white font-semibold">
                  {user.weight} kg
                </span>
              </div>
              {user.height && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Ruler className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Height
                    </span>
                  </div>
                  <span className=" text-slate-800 dark:text-white font-semibold">
                    {user.height} cm
                  </span>
                </div>
              )}
              {user.height && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      BMI
                    </span>
                    {(() => {
                      const bmi = (
                        user.weight / Math.pow(user.height / 100, 2)
                      ).toFixed(1);
                      const getStatus = (b: number) => {
                        if (b < 18.5)
                          return { color: "text-blue-500", bg: "bg-blue500" };
                        if (b < 25)
                          return {
                            color: "text-emerald-500",
                            bg: "bg-emerald-500",
                          };
                        if (b < 30)
                          return {
                            color: "text-orange-500",
                            bg: "bg-orange-500",
                          };
                        return { color: "text-red-500", bg: "bg-red-500" };
                      };
                      const { color, bg } = getStatus(Number(bmi));
                      return (
                        <span
                          className={`px-2 py-1 rounded-full text-lg font-bold ${color} `}
                        >
                          {bmi}
                        </span>
                      );
                    })()}
                  </div>
                  {/* BMI Scale Visual */}
                  <div className="h-2 w-full overflow-hidden flex bg-slate-100 dark:bg-slate-800 rounded-full">
                    <div className="flex-1 bg-blue-400 opacity-30"></div>
                    <div className="flex-1 bg-emerald-400 opacity-30"></div>
                    <div className="flex-1 bg-orange-400 opacity-30"></div>
                    <div className="flex-1 bg-red-400 opacity-30"></div>
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
        {/* Quick Summary */}
        <Card>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
            Today Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">
                Meals Logged
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {todayFoodLog.length}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">
                Total Calories
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {totalCalories} kcal
              </span>
            </div>
            <div className="flex justify-between items-center py-2 ">
              <span className="text-slate-500 dark:text-slate-400">
                Active time
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {totalActiveMinutes} min
              </span>
            </div>
          </div>
        </Card>
        <Card className="col-span-2">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
            This Week's Progress
          </h3>
          <CaloriesChart />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
