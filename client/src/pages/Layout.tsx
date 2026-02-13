import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import NavBar from "@/components/NavBar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";
import SoftBackdrop from "@/components/SoftBackdrop";
import { useAppContext } from "@/context/AppContext";
import type { ActivityEntry, FoodEntry } from "@/types";

function Layout() {
  const { theme } = useTheme();
  const { allFoodLogs, allActivityLogs } = useAppContext();
  const location = useLocation();
  const today = new Date().toISOString().split("T")[0];
  const todayEntries = allFoodLogs.filter(
    (entry: FoodEntry) => entry.createdAt?.split("T")[0] === today,
  );
  const todayActivities = allActivityLogs.filter(
    (activity: ActivityEntry) => activity.createdAt?.split("T")[0] === today,
  );
  const totalCalories = todayEntries.reduce(
    (acc, entry) => acc + entry.calories,
    0,
  );
  const totalMinutes: number = todayActivities.reduce(
    (total, activity) => total + activity.duration,
    0,
  );

  let headerTitle = [
    {
      title: "Dashboard",
      url: "/",
    },
    {
      title: "Food Log",
      subtitle: "Track your daily intake",
      url: "/food",
      rightContent: "Today's Total",
      rightContentValue: `${totalCalories}kcal`,
    },
    {
      title: "Activity Log",
      subtitle: "Track your activity",
      url: "/activity",
      rightContent: "Active Today",
      rightContentValue: `${totalMinutes} min`,
    },
    {
      title: "Profile",
      subtitle: "Manage your settings",
      url: "/profile",
    },
  ];
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <SoftBackdrop />
      <SidebarProvider>
        <NavBar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 ">
            <SidebarTrigger className="-ml-1 " />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex  justify-center flex-col w-full">
              <h1 className="text-lg font-semibold">
                {
                  headerTitle.find((item) => item.url === location.pathname)
                    ?.title
                }
              </h1>
              <p className="text-sm text-muted-foreground">
                {
                  headerTitle.find((item) => item.url === location.pathname)
                    ?.subtitle
                }
              </p>
            </div>
            <div className="flex items-center justify-end w-[20%] flex-col">
              <p className="text-sm text-muted-foreground">
                {
                  headerTitle.find((item) => item.url === location.pathname)
                    ?.rightContent
                }
              </p>
              <p
                className={`text-sm font-semibold ${headerTitle.find((item) => item.url === location.pathname)?.title === "Activity Log" ? "text-blue-600" : "text-emerald-500"}`}
              >
                {
                  headerTitle.find((item) => item.url === location.pathname)
                    ?.rightContentValue
                }
              </p>
            </div>
          </header>
          <div className=" flex-1 ">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Layout;
