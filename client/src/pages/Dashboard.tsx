import { useAppContext } from "@/context/AppContext";

const Dashboard = () => {
  const { user } = useAppContext();
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
          💪 Ready to crush today? Start logging!
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
