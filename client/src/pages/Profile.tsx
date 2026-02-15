import { goalLabels, goalOptions } from "@/assets/assets";
import mockApi from "@/assets/mockApi";
import Button from "@/assets/ui/Button";
import Card from "@/assets/ui/Card";
import Input from "@/assets/ui/Input";
import Select from "@/assets/ui/Select";
import { useAppContext } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import type { ProfileFormData, UserData } from "@/types";
import {
  CalendarIcon,
  LogOutIcon,
  MoonIcon,
  ScaleIcon,
  SunIcon,
  TargetIcon,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Profile() {
  const { user, logout, allActivityLogs, allFoodLogs, fetchUser } =
    useAppContext();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    weight: 0,
    height: 0,
    goal: "maintain",
    dailyCalorieIntake: 2000,
    dailyCalorieBurn: 400,
  });
  const fetchUserData = async () => {
    if (user) {
      setFormData({
        age: user?.age || 0,
        weight: user?.weight || 0,
        height: user?.height || 0,
        goal: user?.goal || "maintain",
        dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
        dailyCalorieBurn: user?.dailyCalorieBurn || 400,
      });
    }
  };
  const handleSave = async () => {
    try {
      const updates: Partial<UserData> = {
        ...formData,
        goal: formData.goal as "lose" | "maintain" | "gain",
      };
      await mockApi.user.update(user?.id || "", updates);
      await fetchUser(user?.token || "");
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    (() => {
      fetchUserData();
    })();
  }, [user]);
  const getStats = () => {
    const totalFoodEntries = allFoodLogs?.length || 0;
    const totalActivityEntries = allActivityLogs?.length || 0;
    return {
      totalFoodEntries,
      totalActivityEntries,
    };
  };
  const stats = getStats();
  if (!user || !formData) return null;
  return (
    <div className="page-container">
      <div className="profile-content">
        {/* left col */}
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <User className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Your Profile
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Memeber since{" "}
                {new Date(user.createdAt || "").toLocaleDateString()}
              </p>
            </div>
          </div>
          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e) })}
                min={13}
                max={120}
              />
              <Input
                label="Weight"
                type="number"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: Number(e) })
                }
                min={20}
                max={300}
              />
              <Input
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: Number(e) })
                }
                min={100}
                max={250}
              />
              <Select
                label="Fitness Goal"
                value={formData.goal}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    goal: v as "lose" | "maintain" | "gain",
                  })
                }
                options={goalOptions}
              />
              <div className="gap-3 flex pt-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      age: user.age || 0,
                      weight: user.weight || 0,
                      height: user.height || 0,
                      goal: user.goal || "maintain",
                      dailyCalorieIntake: user.dailyCalorieIntake || 2000,
                      dailyCalorieBurn: user.dailyCalorieBurn || 400,
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {/* age */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                  <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <CalendarIcon className="size-4.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Age
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {user.age} years
                    </p>
                  </div>
                </div>
                {/* weight */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                  <div className="size-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <ScaleIcon className="size-4.5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Weight
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {user.weight} kg
                    </p>
                  </div>
                </div>
                {/* height */}
                {user.height !== 0 && (
                  <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                    <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <CalendarIcon className="size-4.5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Height
                      </p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {user.height} cm
                      </p>
                    </div>
                  </div>
                )}
                {/* goal */}
                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-colors duration-200">
                  <div className="size-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <TargetIcon className="size-4.5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Goal
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {goalLabels[user.goal || "gain"]}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="w-full mt-4"
              >
                Edit Profile
              </Button>
            </>
          )}
        </Card>
        {/* right col */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              Your Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.totalFoodEntries}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Food Entries
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalActivityEntries}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Activity Entries
                </p>
              </div>
            </div>
          </Card>
          {/* toggle theme button for phone */}
          <div className="lg:hidden">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              {theme === "light" ? (
                <MoonIcon className="size-5" />
              ) : (
                <SunIcon className="size-5" />
              )}
              <span className="text-base">
                {theme === "light" ? "Dark" : "Light"}
              </span>
            </button>
          </div>
          {/* Logout button */}
          <Button
            variant="danger"
            onClick={logout}
            className="w-full ring ring-red-300 hover:ring-2"
          >
            <LogOutIcon className="size-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
