import { makeRequest } from "../api";
import type { GenericResponse } from "../types";
import {
  type ConfirmOTPCredentials,
  type LoginCredentials,
  type LoginResponseData,
  type QuestionsResponse,
  type QuestionnaireSubmitPayload,
  type SendOTPCredentials,
  type SignUpCredentials,
  type SignUpResponseData,
  type VerifyOTPResponse,
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

export const onboardingRequest = (formData: FormData) =>
  makeRequest(`/auth/onboarding`, "POST", formData);

export const confirmSignUpOTPRequest = ({
  email,
  otp,
}: ConfirmOTPCredentials) =>
  makeRequest<GenericResponse<VerifyOTPResponse>>("/auth/verify-otp", "POST", { email, otp });

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

export const questionnairesRequest = () =>
  makeRequest<QuestionsResponse>("/questionnaire/questions");

export const submitQuestionnaireRequest = (payload: QuestionnaireSubmitPayload) =>
  makeRequest("/questionnaire/submit", "POST", payload);
