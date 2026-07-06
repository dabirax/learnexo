import {
  BookOpenText,
  Calculator,
  Landmark,
  ScrollText,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

export type SubjectVisual = {
  icon: LucideIcon;
  color: string;
  bg: string;
};

export const SUBJECT_VISUALS: Record<string, SubjectVisual> = {
  english: { icon: BookOpenText, color: "text-blue-3", bg: "bg-blue-3/10" },
  mathematics: { icon: Calculator, color: "text-purple-1", bg: "bg-purple-1/10" },
  "civic-education": { icon: Landmark, color: "text-green-1", bg: "bg-green-1/10" },
  economics: { icon: ScrollText, color: "text-amber-600", bg: "bg-amber-600/10" },
  "basic-science-and-technology": {
    icon: FlaskConical,
    color: "text-teal-600",
    bg: "bg-teal-600/10",
  },
};

export const DEFAULT_SUBJECT_VISUAL: SubjectVisual = {
  icon: BookOpenText,
  color: "text-gray-6",
  bg: "bg-gray-5",
};

export const getSubjectVisual = (name: string): SubjectVisual =>
  SUBJECT_VISUALS[name] ?? DEFAULT_SUBJECT_VISUAL;
