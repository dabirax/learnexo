import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "../pages/onboarding/pages/authentication/SignUp";
import OnboardingLayout from "../layouts/OnboardingLayout";
import Login from "../pages/onboarding/pages/authentication/Login";
import ForgotPassword from "../pages/onboarding/pages/authentication/ForgotPassword";
import CheckEmail from "../pages/onboarding/pages/authentication/ForgotPasswordCheckEmail";
import ResetPassword from "../pages/onboarding/pages/authentication/ResetPassword";
import ResetPasswordSuccess from "../pages/onboarding/pages/authentication/ResetPasswordSuccess";
import PersonalAndContactInfo from "../pages/onboarding/pages/academic-test/PersonalAndContactInfo";
import ChooseSubject from "../pages/onboarding/pages/academic-test/ChooseSubject";
import AcademicTest from "../pages/onboarding/pages/academic-test/AcademicTest";
import SchoolAndLearning from "../pages/onboarding/pages/academic-test/SchoolAndLearningTest";
import ConfirmOTP from "@/pages/onboarding/pages/authentication/ConfirmOTP";
import QuestionnaireTest from "@/pages/onboarding/pages/academic-test/QuestionnaireTest";
import LoadingTests from "@/pages/onboarding/pages/academic-test/LoadingTests";

const OnboardingRoutes = () => {
  return (
    <Routes>
      <Route path="auth/" element={<OnboardingLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="confirm-otp" element={<ConfirmOTP />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="forgotpassword/checkemail" element={<CheckEmail />} />
        <Route path="resetpassword" element={<ResetPassword />} />
        <Route
          path="resetpassword/success"
          element={<ResetPasswordSuccess />}
        />
      </Route>

      <Route path="test/" element={<OnboardingLayout />}>
        <Route
          index
          element={<Navigate to="personalandcontactinfo" replace />}
        />
        <Route
          path="personalandcontactinfo"
          element={<PersonalAndContactInfo />}
        />
        <Route path="schoolandlearning" element={<SchoolAndLearning />} />
        <Route path="choosesubject" element={<ChooseSubject />} />
        <Route path="preparingtests" element={<LoadingTests />} />
        <Route path="academictest/:id" element={<AcademicTest />} />
        <Route path="questionnairetest/:id" element={<QuestionnaireTest />} />
      </Route>
    </Routes>
  );
};

export default OnboardingRoutes;
