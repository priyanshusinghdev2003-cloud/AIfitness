import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ActivityLog from "./pages/ActivityLog";
import FoodLog from "./pages/FoodLog";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import SignIn from "./pages/SignIn";
import Layout from "./pages/Layout";
import { useAppContext } from "./context/AppContext";
import { Toaster } from "sonner";

const App = () => {
  const { user, isUserFetched } = useAppContext();
  if (!user) {
    return isUserFetched ? <SignIn /> : <p>Loading</p>;
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="food" element={<FoodLog />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<SignIn />} />
      </Routes>
    </>
  );
};

export default App;
