import { makeRequest } from "@/services/api";

export type SubjectProgress = {
  id: string | null;
  name: string;
  code: string;
  label: string;
  progress: number;
  hasData: boolean;
};

export type SubjectsResponse = {
  class: string;
  subjects: SubjectProgress[];
};

export type CategoryProgress = {
  category: string;
  label: string;
  progress: number;
  topicCount: number;
  hasData: boolean;
};

export type CategoriesResponse = {
  class: string;
  subject: { id: string; name: string; label: string; code: string };
  categories: CategoryProgress[];
};

export type TopicProgress = {
  id: string;
  name: string;
  slug: string;
  description: string;
  progress: number;
  instanceCount: number;
  hasData: boolean;
};

export type TopicsResponse = {
  class: string;
  subject: { id: string; name: string };
  category: string;
  label: string;
  topics: TopicProgress[];
};

export type InsightTopic = {
  topicInstanceId: string;
  name: string;
  slug: string;
  accuracy: number;
};

export type InsightResponse =
  | { hasInsight: false }
  | {
      hasInsight: true;
      assessmentId: string;
      completedAt: string;
      score: number;
      weakTopics: InsightTopic[];
      strongTopics: InsightTopic[];
      recommendedNextTopic: { name: string; accuracy: number };
      explanation: string;
    };

export const getSubjectsWithProgress = (gradeClass: string) =>
  makeRequest<SubjectsResponse>(`/assessment/catalog/${gradeClass}/subjects`);

export const getCategoriesWithProgress = (gradeClass: string, subject: string) =>
  makeRequest<CategoriesResponse>(
    `/assessment/catalog/${gradeClass}/${subject}/categories`,
  );

export const getTopicsWithProgress = (
  gradeClass: string,
  subject: string,
  category: string,
) =>
  makeRequest<TopicsResponse>(
    `/assessment/catalog/${gradeClass}/${subject}/categories/${category}/topics`,
  );

export const getSubjectInsight = (gradeClass: string, subject: string) =>
  makeRequest<InsightResponse>(`/assessment/catalog/${gradeClass}/${subject}/insight`);

export const getCategoryInsight = (
  gradeClass: string,
  subject: string,
  category: string,
) =>
  makeRequest<InsightResponse>(
    `/assessment/catalog/${gradeClass}/${subject}/categories/${category}/insight`,
  );
