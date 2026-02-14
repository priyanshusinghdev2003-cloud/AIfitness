import { quickActivities } from "@/assets/assets";
import mockApi from "@/assets/mockApi";
import Button from "@/assets/ui/Button";
import Card from "@/assets/ui/Card";
import Input from "@/assets/ui/Input";
import { useAppContext } from "@/context/AppContext";
import type { ActivityEntry } from "@/types";
import {
  ActivityIcon,
  DumbbellIcon,
  PlusIcon,
  TimerIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ActivityLog = () => {
  const { allActivityLogs, setAllActivityLogs } = useAppContext();

  const [activites, setActivites] = useState<ActivityEntry[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    duration: 0,
    calories: 0,
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const today = new Date().toISOString().split("T")[0];
  const loadActivities = () => {
    const todayActivities = allActivityLogs.filter(
      (activity: ActivityEntry) => activity.createdAt?.split("T")[0] === today,
    );
    setActivites(todayActivities);
  };
  useEffect(() => {
    (() => {
      loadActivities();
    })();
  }, [allActivityLogs]);

  const handleQuickAdd = (activity: { name: string; rate: number }) => {
    setFormData({
      name: activity.name,
      calories: 30 * activity.rate,
      duration: 30,
    });
    setShowForm(true);
  };
  const handleDurationChange = (val: string | number) => {
    const duration = Number(val);
    const activity = quickActivities.find(
      (activity) => activity.name === formData.name,
    );
    let calories = formData.calories;
    if (activity) {
      calories = duration * activity.rate;
    }
    setFormData({ ...formData, duration, calories });
  };
  const totalMinutes: number = activites.reduce(
    (total, activity) => total + activity.duration,
    0,
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      formData.duration <= 0 ||
      formData.calories <= 0
    ) {
      toast.error("Please Enter Valid Data");
      return;
    }
    setLoading(true);
    try {
      const { data } = await mockApi.activityLogs.create({ data: formData });
      setAllActivityLogs((prev) => [...prev, data]);
      setShowForm(false);
      setError("");
      setFormData({ name: "", duration: 0, calories: 0 });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await mockApi.activityLogs.delete(id);
      setAllActivityLogs((prev) =>
        prev.filter((activity) => String(activity.id) !== String(id)),
      );
      toast.success("Activity deleted successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="page-content-grid">
      {/* Quick Add Section */}
      {!showForm && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Quick Add
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickActivities.map((activity) => (
                <button
                  onClick={() => handleQuickAdd(activity)}
                  key={activity.name}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  {activity.emoji} {activity.name}
                </button>
              ))}
            </div>
          </Card>
          <Button className="w-full" onClick={() => setShowForm(true)}>
            <PlusIcon className="size-5" /> Add Custom Activity
          </Button>
        </div>
      )}
      {/* Add Form Section */}
      {showForm && (
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3">
            Add Custom Activity
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Activity Name"
              placeholder="e.g., Morning Run"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.toString() })}
              required
            />
            <div className="flex gap-4">
              <Input
                label="Duration (min)"
                type="number"
                placeholder="30"
                required
                value={formData.duration}
                onChange={(e) => handleDurationChange(e)}
                className="flex-1"
                min={0}
              />
              <Input
                label="Calories Burned"
                type="number"
                placeholder="200"
                value={formData.calories}
                onChange={(e) =>
                  setFormData({ ...formData, calories: Number(e) })
                }
                min={1}
                max={2000}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                  setFormData({ name: "", duration: 0, calories: 0 });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Activity
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Activity List Section */}
      {activites.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <DumbbellIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
            No activites logged today
          </h3>
          <p className="text-sm ttext-slate-500 dark:text-slate-400 ">
            Start moving and track your progress
          </p>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center  mb-4 gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ActivityIcon className="size-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">
                Today's Activities
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {activites.length} logged
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {activites.map((activity) => (
              <div key={activity.id} className="activity-entry-item">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <TimerIcon className="size-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-200">
                      {activity.name}
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-400">
                      {new Date(activity?.createdAt || "").toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}{" "}
                      - {activity.duration} min
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {activity.duration} min
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activity.calories} kcal
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(activity.documentId)}
                    className="p-2 text-red-400 cursor-pointer hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* total summary */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="text-slate-500 dar:text-slate-400">
              Total Active Time
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {totalMinutes} min
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ActivityLog;
