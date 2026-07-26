import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "../layouts/MainLayout";
import SuspenseFallback from "@/components/SuspenseFallback";

const Assessment = lazy(() => import("@/pages/assessment/Assessment"));
const ClassPage = lazy(() => import("@/pages/assessment/ClassPage"));
const SubjectPage = lazy(() => import("@/pages/assessment/SubjectPage"));
const CategoryPage = lazy(() => import("@/pages/assessment/CategoryPage"));

const AssessmentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <ClassPage />
            </Suspense>
          }
        />
        <Route
          path=":gradeClass/:subject"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <SubjectPage />
            </Suspense>
          }
        />
        <Route
          path=":gradeClass/:subject/category/:category"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <CategoryPage />
            </Suspense>
          }
        />
        <Route
          path=":subject/:gradeClass/:id"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <Assessment />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default AssessmentRoutes;
