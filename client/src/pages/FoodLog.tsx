import {
  mealColors,
  mealIcons,
  mealTypeOptions,
  quickActivitiesFoodLog,
} from "@/assets/assets";
import Button from "@/assets/ui/Button";
import Card from "@/assets/ui/Card";
import Input from "@/assets/ui/Input";
import Select from "@/assets/ui/Select";
import api from "@/config/api";
import { useAppContext } from "@/context/AppContext";
import type { FoodEntry, FormData } from "@/types";
import {
  Loader2Icon,
  PlusIcon,
  SparkleIcon,
  Trash2Icon,
  UtensilsCrossedIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function FoodLog() {
  const { allFoodLogs, setAllFoodLogs } = useAppContext();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    calories: 0,
    mealType: "",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const today = new Date().toISOString().split("T")[0];
  const loadEntries = async () => {
    const todaysEntries = allFoodLogs.filter(
      (entry) => entry.createdAt?.split("T")[0] === today,
    );
    setEntries(todaysEntries);
  };
  useEffect(() => {
    loadEntries();
  }, [allFoodLogs]);
  // group entries by meal type
  const groupedEntries: Record<
    "breakfast" | "lunch" | "dinner" | "snack",
    FoodEntry[]
  > = entries.reduce(
    (acc, entry) => {
      if (!acc[entry.mealType]) {
        acc[entry.mealType] = [];
      }
      acc[entry.mealType].push(entry);
      return acc;
    },
    {} as Record<"breakfast" | "lunch" | "dinner" | "snack", FoodEntry[]>,
  );
  const handleQuickAdd = (name: string) => {
    setFormData({ ...formData, mealType: name });
    setShowForm(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    // implement image analysis
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/api/image-analysis", formData);
      const result = data.result;
      let mealType = "";
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 12) {
        mealType = "breakfast";
      } else if (hour >= 12 && hour < 16) {
        mealType = "lunch";
      } else if (hour >= 16 && hour < 18) {
        mealType = "snack";
      } else {
        mealType = "dinner";
      }
      if (!mealType || !result.name || !result.calories) {
        toast.error("Failed to analyze food");
        return;
      }
      const { data: newEntry } = await api.post("/api/food-logs", {
        data: { name: result.name, calories: result.calories, mealType },
      });
      setEntries((prev) => [...prev, newEntry]);
      setAllFoodLogs((prev) => [...prev, newEntry]);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to add entry");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.calories ||
      formData.calories <= 0 ||
      !formData.mealType
    ) {
      toast.error("Please Enter Valid Food Details");
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post("/api/food-logs", { data: formData });
      setAllFoodLogs((prev) => [...prev, data]);
      setFormData({ name: "", calories: 0, mealType: "" });
      setShowForm(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to add entry");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this entry?",
      );
      if (!confirm) return;
      await api.delete(`/api/food-logs/${id}`);
      setAllFoodLogs((prev) => prev.filter((entry) => entry.documentId !== id));
      setEntries((prev) => prev.filter((entry) => entry.documentId !== id));
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Failed to delete entry");
    }
  };
  return (
    <div className="page-container">
      <div className="page-content-grid">
        {!showForm && (
          <div className="space-y-2">
            <Card>
              <h3 className="font-semibold text-slate-700 dar:text-slate-200 mb-3">
                Quick Add
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickActivitiesFoodLog.map((item) => (
                  <button
                    key={item.name}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                    onClick={() => handleQuickAdd(item.name)}
                  >
                    {item.emoji} {item.name}
                  </button>
                ))}
              </div>
            </Card>
            <Button className="w-full" onClick={() => setShowForm(true)}>
              <PlusIcon className="size-5" /> Add Food Entry
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                inputRef.current?.click();
              }}
            >
              <SparkleIcon className="size-5" /> AI Food Snap
            </Button>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
              ref={inputRef}
            />
            {loading && (
              <div className="fixed inset-0 backdrop-blur flex items-center justify-center z-100">
                <Loader2Icon className="size-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
              </div>
            )}
          </div>
        )}
        {/* Add Form */}
        {showForm && (
          <Card className="border-2 border-emerald-200 dark:border-emerald-800">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
              New Food Entry
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Food Name"
                value={formData.name}
                onChange={(v) =>
                  setFormData({ ...formData, name: v.toString() })
                }
                placeholder="e.g., Grilled Chicken Salad"
              />
              <Input
                label="Calories"
                type="number"
                value={formData.calories}
                onChange={(v) =>
                  setFormData({ ...formData, calories: Number(v) })
                }
                placeholder="e.g., 450"
                required
                min={1}
              />
              <Select
                label="Meal Type"
                value={formData.mealType}
                onChange={(v) =>
                  setFormData({ ...formData, mealType: v.toString() })
                }
                options={mealTypeOptions}
                required
                placeholder="Select Meal Type"
              />
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1"
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: "", calories: 0, mealType: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" type="submit">
                  Add Entry
                </Button>
              </div>
            </form>
          </Card>
        )}
        {/* Entries List */}
        {entries.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossedIcon className="size-8 text-slate-400 dar:text-slate-500" />
            </div>
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">
              No Food Entries Yet
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Start by adding your first food entry to track your nutrition
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
              const mealTypeKey = mealType as keyof typeof groupedEntries;

              if (!groupedEntries[mealTypeKey]) return null;
              const MealIcon = mealIcons[mealTypeKey];
              const mealCalories = groupedEntries[mealTypeKey].reduce(
                (total, entry) => total + entry.calories,
                0,
              );

              return (
                <Card key={mealType}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${mealColors[mealTypeKey]}`}
                      >
                        <MealIcon className="size-5 " />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200 capitalize">
                          {mealType}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {groupedEntries[mealTypeKey].length} items
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {mealCalories} kcal
                    </p>
                  </div>
                  <div className="space-y-2">
                    {groupedEntries[mealTypeKey].map((entry) => (
                      <div key={entry.id} className="food-entry-item">
                        <div className="flex-1">
                          <p className="font-medium text-slate-700 dark:text-slate-200">
                            {entry.name}
                          </p>
                          <p className="text-sm text-slate-400">{}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {entry.calories} kcal
                          </span>
                          <Button
                            onClick={() =>
                              handleDelete(entry?.documentId || "")
                            }
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2Icon className="size-4 " />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodLog;
