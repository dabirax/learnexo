import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import SuspenseFallback from "@/components/SuspenseFallback";

const Landing = lazy(() => import("../pages/landing/Landing"));
const OnboardingRoutes = lazy(() => import("./OnboardingRoutes"));
const DashboardRoutes = lazy(() => import("./DashboardRoutes"));
const AssessmentRoutes = lazy(() => import("./AssessmentRoutes"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding/*" element={<OnboardingRoutes />} />
          <Route path="/dashboard/*" element={<DashboardRoutes />} />
          <Route path="/assessment/*" element={<AssessmentRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
