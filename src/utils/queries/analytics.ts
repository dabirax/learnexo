import { makeRequest } from "@/services/api";

export type AnalyticsResponse = {
  classMastery: Record<string, number>;
  subjectProgress: Record<string, { date: string; score: number }[]>;
  topicComparison: Record<string, { topic: string; previousMastery: number; currentMastery: number; bktProbability: number }[]>;
  categoryMastery: Record<string, { category: string; mastery: number }[]>;
};

export type BktTracesResponse = {
  traces: Record<string, { topic: string; history: { date: string; mastery: number }[] }[]>;
};

export const getAnalytics = () =>
  makeRequest<AnalyticsResponse>("/assessment/analytics");

export const getBktTraces = () =>
  makeRequest<BktTracesResponse>("/assessment/bkt-traces");
