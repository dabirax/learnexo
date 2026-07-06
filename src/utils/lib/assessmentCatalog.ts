export const SUBJECT_LABELS: Record<string, string> = {
  english: "English Language",
  mathematics: "Mathematics",
  "civic-education": "Civic Education",
  economics: "Economics",
  "basic-science-and-technology": "Basic Science and Technology",
};

export const normalizeClass = (input: string): string =>
  input.toLowerCase().replace(/\s+/g, "").trim();

export const classLabel = (klass: string): string => klass.toUpperCase();
