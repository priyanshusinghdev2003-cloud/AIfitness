import { quickActivitiesFoodLog } from "@/assets/assets";
import Button from "@/assets/ui/Button";
import Card from "@/assets/ui/Card";
import { useAppContext } from "@/context/AppContext";
import type { FoodEntry, FormData } from "@/types";
import { PlusIcon, SparkleIcon } from "lucide-react";
import { useRef, useState } from "react";

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
  const handleQuickAdd = (name: string) => {
    setFormData({ ...formData, mealType: name });
    setShowForm(true);
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
            <input type="file" accept="image/*" hidden ref={inputRef} />
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodLog;
