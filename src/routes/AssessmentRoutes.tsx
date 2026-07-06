import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Assessment from "@/pages/assessment/Assessment";
import ClassPage from "@/pages/assessment/ClassPage";
import SubjectPage from "@/pages/assessment/SubjectPage";
import CategoryPage from "@/pages/assessment/CategoryPage";

const AssessmentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<ClassPage />} />
        <Route path=":gradeClass/:subject" element={<SubjectPage />} />
        <Route
          path=":gradeClass/:subject/category/:category"
          element={<CategoryPage />}
        />
        <Route path=":subject/:gradeClass/:id" element={<Assessment />} />
      </Route>
    </Routes>
  );
};

export default AssessmentRoutes;
