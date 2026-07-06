import { useRequest } from "../hooks/useRequest";
import { type Answer } from "../types/baseTypes";

type AssessmentRequest = {
  subject: string;
  gradeClass: string;
};

export const getAssessmentRequest = async ({
  subject,
  gradeClass,
}: AssessmentRequest) => {
  return await useRequest(`/assessment/${subject}/${gradeClass}`);
};

export const submitAssessmentRequest = async ({
  assessmentId,
  answers,
}: {
  assessmentId: string;
  answers: Answer[];
}) => {
  return await useRequest(
    "/assessment/submit",
    "POST",
    JSON.stringify({ assessmentId, answers })
  );
};
