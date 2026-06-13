import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Profile from "@/pages/profile/Profile";
import Questionnaire from "@/pages/onboarding/pages/academic-test/Questionnaire";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="questionnaire" element={<Questionnaire retake />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
