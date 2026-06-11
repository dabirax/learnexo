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
  schoolAddress: string;
  schoolName: string;
  state: string;
  town: string;
  gender: string;
  class: string;
  dateOfBirth: string;
};

export type VerifyOTPResponse = {
  accessToken: string;
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

export type QuestionOption = {
  key: string;
  text: string;
};

export type QuestionnaireQuestion = {
  _id: string;
  questionNumber: string;
  question: string;
  options: QuestionOption[];
};

export type QuestionsResponse = {
  total: number;
  questions: QuestionnaireQuestion[];
};

export type QuestionnaireAnswer = {
  questionNumber: string;
  selected: string;
};

export type QuestionnaireSubmitPayload = {
  userId: string;
  answers: QuestionnaireAnswer[];
};
