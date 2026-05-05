export type LoginCredentials = {
  email: string;
  password: string;
};

export type ConfirmOTPCredentials = {
  email: string;
  otp: string;
};

export type SendOTPCredentials = {
  email: string;
};

export type SignUpCredentials = LoginCredentials & {
  firstName: string;
  lastName: string;
  role: string;
};

export type OnboardingCredentials = {
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

export interface SignUpResponseData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
  userId: string;
}

export interface LoginResponseData {
  accessToken: string;
  user: SignUpResponseData;
}
