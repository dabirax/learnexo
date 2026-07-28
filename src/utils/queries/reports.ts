import { makeRequest } from "@/services/api";
import type { AiContentItem } from "./assessmentCatalog";

export type AssessmentHistoryItem = {
  assessmentId: string;
  subject: string;
  class: string;
  type: string;
  score: number;
  completedAt: string;
  title: string;
  category: string;
  topic: string;
};

export type HistoryResponse = {
  history: AssessmentHistoryItem[];
};

export type CorrectionItem = {
  questionNumber: number;
  question: string;
  options: { key: string; text: string }[];
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
};

export type CorrectionsResponse = {
  assessmentId: string;
  totalQuestions: number;
  attempted: number;
  corrections: CorrectionItem[];
};

export type ReportResponse = {
  assessmentId: string;
  completedAt: string;
  subject: string;
  class: string;
  score: number;
  weakTopics: { topicInstanceId: string; name: string; slug: string; accuracy: number; bktProbability: number }[];
  strongTopics: { topicInstanceId: string; name: string; slug: string; accuracy: number; bktProbability: number }[];
  recommendedNextTopic: { name: string; accuracy: number };
  explanation: string;
  recommendations: { feedback: string; recommend_for: string; recommended_topic: string }[];
  aiContent?: AiContentItem[] | null;
  corrections: CorrectionItem[];
};

export const getAssessmentHistory = () =>
  makeRequest<HistoryResponse>("/assessment/history");

export const getAssessmentReport = (assessmentId: string) =>
  makeRequest<ReportResponse>(`/assessment/${assessmentId}/report`);
