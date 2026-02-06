import { ageRanges, goalOptions } from "@/assets/assets";
import mockApi from "@/assets/mockApi";
import ProgressBar from "@/assets/ui/ProgressBar";
import Slider from "@/assets/ui/Slider";
import SoftBackdrop from "@/components/SoftBackdrop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppContext } from "@/context/AppContext";
import { type ProfileFormData, type UserData } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  InfoIcon,
  PersonStanding,
  ScaleIcon,
  Target,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function Onboarding() {
  const [step, setStep] = useState<number>(3);
  const { user, setOnboardingCompleted, fetchUser } = useAppContext();
  const [formData, setFormData] = useState<ProfileFormData>({
    age: 0,
    height: 0,
    weight: 0,
    goal: "maintain",
    dailyCalorieBurn: 2000,
    dailyCalorieIntake: 400,
  });
  const totalSteps = 3;
  const updateField = (
    field: keyof ProfileFormData,
    value: string | number,
  ) => {
    setFormData({ ...formData, [field]: value });
  };
  const handleNext = async () => {
    if (step == 1) {
      if (
        !formData.age ||
        Number(formData.age) < 13 ||
        Number(formData.age) > 120
      ) {
        return toast.error("Age sis required");
      }
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const userData = {
        ...formData,
        age: Number(formData.age),
        height: formData.height ? Number(formData.height) : null,
        weight: Number(formData.weight),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("fitnessUser", JSON.stringify(userData));
      await mockApi.user.update(
        user?.id || "",
        userData as unknown as Partial<UserData>,
      );
      toast.success("Profile updated successfully");
      setOnboardingCompleted(true);
      fetchUser(user?.token || "");
    }
  };
  return (
    <div className="w-full min-h-screen flex flex-col ">
      <SoftBackdrop />
      <div className="p-6 pt-12 flex  justify-center flex-col">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
            <PersonStanding className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Fittrack
          </h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          Your Personalized Fitness Assistant
        </p>
      </div>
      <div className="px-6 mb-8">
        <div className="flex gap-2 max-w-2xl">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`}
            />
          ))}
        </div>
        <p className="text-sm text-slate-400 mt-3">
          Step {step} of {totalSteps}
        </p>
      </div>
      <div className="flex-1 px-6">
        {step == 1 && (
          <div className="space-y-6 ">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center">
                <User className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="">
                <h2 className="text-lg font-semibold">How old are you ?</h2>
                <p className="text-sm text-muted-foreground">
                  This help us calculate your needs
                </p>
              </div>
            </div>
            <div className="space-y-2 max-w-2xl">
              <Label>
                Age <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => updateField("age", Number(e.target.value))}
                min={13}
                max={120}
                required
              />
            </div>
          </div>
        )}

        {step == 2 && (
          <div className="space-y-6 ">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center">
                <ScaleIcon className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="">
                <h2 className="text-lg font-semibold">Your measurements</h2>
                <p className="text-sm text-muted-foreground">
                  Help us track your progress
                </p>
              </div>
            </div>
            <div className="space-y-2 max-w-2xl">
              <Label>
                Weight (kg) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => updateField("weight", Number(e.target.value))}
                min={20}
                max={300}
                required
              />
            </div>
            <div className="space-y-2 max-w-2xl">
              <Label>Height (cm) - Optional</Label>
              <Input
                type="number"
                value={formData.height}
                onChange={(e) => updateField("height", Number(e.target.value))}
                min={120}
                max={250}
              />
            </div>
          </div>
        )}
        {step == 3 && (
          <div className="space-y-6 ">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center">
                <Target className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="">
                <h2 className="text-lg font-semibold">What's your goal?</h2>
                <p className="text-sm text-muted-foreground">
                  We'll tailor your experience
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-2 space-y-4 max-w-lg">
              {goalOptions.map((option) => (
                <button
                  key={option.value}
                  className={`p-2 rounded-md ${formData.goal === option.value ? "bg-white/20 text-emerald-600 ring-2 ring-emerald-600" : "bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50"} cursor-pointer transition-all duration-300 ease-in-out`}
                  onClick={() => {
                    const age = Number(formData.age);
                    const range =
                      ageRanges.find((r) => age <= r.max) ||
                      ageRanges[ageRanges.length - 1];
                    let intake = range.maintain;
                    let burn = range.burn;
                    if (option.value == "lose") {
                      intake -= 400;
                      burn += 100;
                    } else if (option.value == "gain") {
                      intake += 500;
                      burn -= 100;
                    }
                    setFormData({
                      ...formData,
                      goal: option.value as "lose" | "gain" | "maintain",
                      dailyCalorieIntake: intake,
                      dailyCalorieBurn: burn,
                    });
                  }}
                >
                  {option.label}
                </button>
              ))}
              <Separator />
            </div>

            <div className="max-w-lg space-y-8">
              <h2 className="text-md font-medium text-slate-800 dark:text-white mb-4">
                Daily Targets
              </h2>
              <div className="space-y-6">
                <Slider
                  max={3970}
                  min={1200}
                  label="Daily Calorie Intake"
                  step={50}
                  value={formData.dailyCalorieIntake}
                  onChange={(value) =>
                    setFormData({ ...formData, dailyCalorieIntake: value })
                  }
                  unit="kcal"
                  infoText="The Total calories you plan to consume each day"
                />
              </div>
              <div className="space-y-6">
                <Slider
                  max={3970}
                  min={1200}
                  label="Daily Calorie Burn"
                  step={50}
                  value={formData.dailyCalorieBurn}
                  onChange={(value) =>
                    setFormData({ ...formData, dailyCalorieBurn: value })
                  }
                  unit="kcal"
                  infoText="The Total calories you plan to burn each day"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 m-10  ">
        {step > 1 && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setStep(step > 1 ? step - 1 : 1)}
          >
            <ArrowLeft /> Back
          </Button>
        )}
        <Button
          variant="default"
          className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2 "
          onClick={handleNext}
        >
          {step === totalSteps ? "Get Started" : "Continue"} <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default Onboarding;
