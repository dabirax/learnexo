import { makeRequest } from "@/services/api";
import { type Answer } from "../types/baseTypes";

type AssessmentRequest = {
  subject: string;
  gradeClass: string;
  category?: string;
  topic?: string;
};

export type AssessmentQuestionsResponse = {
  assessmentId: string;
  total: number;
  questions: Array<{
    question: string;
    options: Array<{ key: string; text: string }>;
    _id: string;
  }>;
};

export type SubmitAssessmentResponse = {
  recommendations: Array<{
    feedback: string;
    recommend_for: string;
    recommended_topic: string;
  }>;
};

export const getAssessmentRequest = async ({
  subject,
  gradeClass,
  category,
  topic,
}: AssessmentRequest): Promise<AssessmentQuestionsResponse> => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (topic) params.append("topic", topic);
  const query = params.toString();
  const path = `/assessment/${subject}/${gradeClass}${query ? `?${query}` : ""}`;
  return await makeRequest<AssessmentQuestionsResponse>(path);
};

export const submitAssessmentRequest = async ({
  assessmentId,
  answers,
}: {
  assessmentId: string;
  answers: Answer[];
}): Promise<SubmitAssessmentResponse> => {
  return await makeRequest<SubmitAssessmentResponse>("/assessment/submit", "POST", {
    assessmentId,
    answers,
  });
};
