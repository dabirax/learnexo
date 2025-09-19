import { useRequest } from "../hooks/useRequest";

type LoginCredentials = {
  email: string;
  password: string;
};

type ConfirmOTPCredentials = {
  email: string;
  otp: string;
};

type SendOTPCredentials = {
  email: string;
};

type SignUpCredentials = LoginCredentials & {
  firstName: string;
  lastName: string;
  role: string;
  userImage?: string;
};

type OnboardingCredentials = {
  stateOfOrigin: string;
  residentialAddress: string;
  language: string;
  photo?: string;
  pastExam: {
    thirdTerm: string;
    secondTerm: string;
    firstTerm: string;
  };
  learningStyle: string;
  schoolAddress: string;
  schoolName: string;
  state: string;
  town: string;
  gender: string;
  class: string;
  dateOfBirth: Date;
};

export const loginUserRequest = async ({ email, password }: LoginCredentials) =>
  await useRequest("/auth/login", "POST", JSON.stringify({ email, password }));

export const signupUserRequest = async ({
  firstName,
  lastName,
  role,
  email,
  password,
}: SignUpCredentials) =>
  await useRequest(
    "/auth/sign-in",
    "POST",
    JSON.stringify({
      firstName,
      lastName,
      role,
      email,
      password,
      userImage: "https://image.com",
    })
  );

export const confirmSignUpOTPRequest = async ({
  email,
  otp,
}: ConfirmOTPCredentials) =>
  await useRequest("/auth/verify", "POST", JSON.stringify({ email, otp }));

export const confirmOTPRequest = async ({
  email,
  otp,
}: ConfirmOTPCredentials) =>
  await useRequest("/auth/verify-otp", "POST", JSON.stringify({ email, otp }));

export const sendOTPToEmailRequest = async ({ email }: SendOTPCredentials) =>
  await useRequest(`/auth/send-otp/${email}`);

export const resetPasswordRequest = async ({
  email,
  password,
}: LoginCredentials) =>
  await useRequest(
    "/auth/reset-password",
    "POST",
    JSON.stringify({
      email,
      password,
    })
  );

export const onboardingRequest = async ({
  values,
  userId,
}: {
  values: OnboardingCredentials;
  userId: string;
}) =>
  await useRequest(
    `/auth/onboarding/${userId}`,
    "POST",
    JSON.stringify({
      ...values,
    })
  );

export const uploadImageRequest = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await useRequest("/upload", "POST", formData);
};

export const assessmentsRequest = async () => {
  return await useRequest("/assessment/Assessment");
};

export const questionnairesRequest = async () => {
  return await useRequest("/assessment/Questionnaire");
};
