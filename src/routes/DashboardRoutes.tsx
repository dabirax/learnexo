import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Profile from "@/pages/profile/Profile";
import Questionnaire from "@/pages/onboarding/pages/academic-test/Questionnaire";
import ReportsList from "@/pages/reports/ReportsList";
import ReportDetail from "@/pages/reports/ReportDetail";
import Analytics from "@/pages/analytics/Analytics";
import Courses from "@/pages/courses/Courses";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="questionnaire" element={<Questionnaire retake />} />
        <Route path="reports" element={<ReportsList />} />
        <Route path="reports/:assessmentId" element={<ReportDetail />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="courses" element={<Courses />} />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
