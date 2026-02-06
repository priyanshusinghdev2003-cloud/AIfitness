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

function Layout() {
  const { theme } = useTheme();
  const location = useLocation();

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
    },
    {
      title: "Activity Log",
      subtitle: "Track your activity",
      url: "/activity",
      rightContent: "Active Today",
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
            <div className="flex items-center justify-end w-[20%]">
              <p className="text-sm text-muted-foreground">
                {
                  headerTitle.find((item) => item.url === location.pathname)
                    ?.rightContent
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
