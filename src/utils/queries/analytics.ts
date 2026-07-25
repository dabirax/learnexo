import { makeRequest } from "@/services/api";

export type AnalyticsResponse = {
  classMastery: Record<string, number>;
  subjectProgress: Record<string, { date: string; score: number }[]>;
  topicComparison: Record<string, { topic: string; previousMastery: number; currentMastery: number }[]>;
};

export const getAnalytics = () =>
  makeRequest<AnalyticsResponse>("/assessment/analytics");
