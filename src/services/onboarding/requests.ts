import { makeRequest } from "../api";
import type { GenericResponse } from "../types";
import {
  type ConfirmOTPCredentials,
  type LoginCredentials,
  type LoginResponseData,
  type OnboardingCredentials,
  type SendOTPCredentials,
  type SignUpCredentials,
  type SignUpResponseData,
} from "./types";

export const loginUserRequest = ({ email, password }: LoginCredentials) =>
  makeRequest<GenericResponse<LoginResponseData>>("/auth/login", "POST", {
    email,
    password,
  });

export const signupUserRequest = (payload: SignUpCredentials) =>
  makeRequest<GenericResponse<SignUpResponseData>>(
    "/auth/sign-up",
    "POST",
    payload,
  );

export const confirmOTPRequest = ({ email, otp }: ConfirmOTPCredentials) =>
  makeRequest("/auth/verify-otp", "POST", { email, otp });

export const sendOTPToEmailRequest = ({ email }: SendOTPCredentials) =>
  makeRequest<GenericResponse<null>>(`/auth/send-otp/${email}`);

export const onboardingRequest = ({
  values,
  userId,
}: {
  values: OnboardingCredentials;
  userId: string;
}) =>
  makeRequest(`/auth/onboarding/${userId}`, "POST", {
    ...values,
  });

export const confirmSignUpOTPRequest = ({
  email,
  otp,
}: ConfirmOTPCredentials) =>
  makeRequest("/auth/verify-otp", "POST", { email, otp });

export const resetPasswordRequest = ({ email, password }: LoginCredentials) =>
  makeRequest("/auth/reset-password", "POST", {
    email,
    password,
  });

export const uploadImageRequest = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return makeRequest("/upload", "POST", formData);
};

export const assessmentsRequest = () => {
  return makeRequest("/assessment/Assessment");
};

export const questionnairesRequest = () => {
  return makeRequest("/assessment/Questionnaire");
};
