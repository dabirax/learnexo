import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "../layouts/MainLayout";
import SuspenseFallback from "@/components/SuspenseFallback";

const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Profile = lazy(() => import("@/pages/profile/Profile"));
const Questionnaire = lazy(() => import("@/pages/onboarding/pages/academic-test/Questionnaire"));
const ReportsList = lazy(() => import("@/pages/reports/ReportsList"));
const ReportDetail = lazy(() => import("@/pages/reports/ReportDetail"));
const Analytics = lazy(() => import("@/pages/analytics/Analytics"));
const Courses = lazy(() => import("@/pages/courses/Courses"));

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="questionnaire"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <Questionnaire retake />
            </Suspense>
          }
        />
        <Route
          path="reports"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <ReportsList />
            </Suspense>
          }
        />
        <Route
          path="reports/:assessmentId"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <ReportDetail />
            </Suspense>
          }
        />
        <Route
          path="analytics"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <Analytics />
            </Suspense>
          }
        />
        <Route
          path="courses"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <Courses />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default MainRoutes;
