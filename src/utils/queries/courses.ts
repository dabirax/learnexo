import { makeRequest } from "@/services/api";

export type ContentItem = {
  id: string;
  title: string;
  description?: string;
  type: "video" | "audio" | "text" | "interactive";
  url?: string;
  coverImage?: string;
  topic: string;
  category: string;
  priority: number;
  createdAt: string;
  subject?: string;
};

export type CoursesResponse = {
  recent: ContentItem[];
  bySubject: Record<string, ContentItem[]>;
};

export const getCourses = () =>
  makeRequest<CoursesResponse>("/assessment/courses");
