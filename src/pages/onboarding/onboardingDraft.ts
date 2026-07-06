import {
  getSessionStorage,
  setSessionStorage,
  removeSessionStorage,
} from "@/utils/session";

const DRAFT_KEY = "onboardingDraft";

export type OnboardingDraft = {
  dateOfBirth?: string;
  gender?: string;
  residentialAddress?: string;
  town?: string;
  state?: string;
  stateOfOrigin?: string;
  language?: string;
  schoolName?: string;
  studentClass?: string;
  schoolAddress?: string;
  firstTerm?: string;
  secondTerm?: string;
  thirdTerm?: string;
};

let onboardingPhoto: File | null = null;
let onboardingPhotoPreview: string | null = null;

export const getOnboardingDraft = (): OnboardingDraft =>
  getSessionStorage(DRAFT_KEY) ?? {};

export const saveOnboardingDraft = (values: Partial<OnboardingDraft>) => {
  setSessionStorage(DRAFT_KEY, { ...getOnboardingDraft(), ...values });
};

export const setOnboardingPhoto = (file: File | null) => {
  if (onboardingPhotoPreview) {
    URL.revokeObjectURL(onboardingPhotoPreview);
  }
  onboardingPhoto = file;
  onboardingPhotoPreview = file ? URL.createObjectURL(file) : null;
};

export const getOnboardingPhoto = () => onboardingPhoto;

export const getOnboardingPhotoPreview = () => onboardingPhotoPreview;

export const clearOnboardingDraft = () => {
  removeSessionStorage(DRAFT_KEY);
  if (onboardingPhotoPreview) {
    URL.revokeObjectURL(onboardingPhotoPreview);
  }
  onboardingPhoto = null;
  onboardingPhotoPreview = null;
};
