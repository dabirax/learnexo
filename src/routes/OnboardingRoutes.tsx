import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import OnboardingLayout from "../layouts/OnboardingLayout";
import SuspenseFallback from "@/components/SuspenseFallback";

const SignUp = lazy(() => import("../pages/onboarding/pages/authentication/SignUp"));
const Login = lazy(() => import("../pages/onboarding/pages/authentication/Login"));
const ForgotPassword = lazy(() => import("../pages/onboarding/pages/authentication/ForgotPassword"));
const CheckEmail = lazy(() => import("../pages/onboarding/pages/authentication/ForgotPasswordCheckEmail"));
const ResetPassword = lazy(() => import("../pages/onboarding/pages/authentication/ResetPassword"));
const ResetPasswordSuccess = lazy(() => import("../pages/onboarding/pages/authentication/ResetPasswordSuccess"));
const PersonalAndContactInfo = lazy(() => import("../pages/onboarding/pages/academic-test/PersonalAndContactInfo"));
const SchoolAndLearning = lazy(() => import("../pages/onboarding/pages/academic-test/SchoolAndLearningTest"));
const ConfirmOTP = lazy(() => import("@/pages/onboarding/pages/authentication/ConfirmOTP"));
const Questionnaire = lazy(() => import("@/pages/onboarding/pages/academic-test/Questionnaire"));

const OnboardingRoutes = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
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
    </Suspense>
  );
};

export default OnboardingRoutes;
