import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "../pages/onboarding/pages/authentication/SignUp";
import OnboardingLayout from "../layouts/OnboardingLayout";
import Login from "../pages/onboarding/pages/authentication/Login";
import ForgotPassword from "../pages/onboarding/pages/authentication/ForgotPassword";
import CheckEmail from "../pages/onboarding/pages/authentication/ForgotPasswordCheckEmail";
import ResetPassword from "../pages/onboarding/pages/authentication/ResetPassword";
import ResetPasswordSuccess from "../pages/onboarding/pages/authentication/ResetPasswordSuccess";
import PersonalAndContactInfo from "../pages/onboarding/pages/academic-test/PersonalAndContactInfo";
import SchoolAndLearning from "../pages/onboarding/pages/academic-test/SchoolAndLearningTest";
import ConfirmOTP from "@/pages/onboarding/pages/authentication/ConfirmOTP";
import Questionnaire from "@/pages/onboarding/pages/academic-test/Questionnaire";

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
        <Route path="questionnaire" element={<Questionnaire />} />
      </Route>
    </Routes>
  );
};

export default OnboardingRoutes;
