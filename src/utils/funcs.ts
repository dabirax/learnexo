import type { BaseQuestion } from "./types/baseTypes";

export const removeAndReturn = <T extends Record<string, any>>(
  obj: T,
  key: keyof T
) => {
  const removed = obj[key];
  delete obj[key];
  return removed;
};

export const localToISOString = (localString: string) => {
  if (!localString) return "";
  const date = new Date(localString);
  return date.toISOString(); // → "2025-07-24T18:54:00.000Z"
};

export const mmddyyyyToISO = (dateStr: string): string => {
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(yyyy, mm - 1, dd));
  if (isNaN(date.getTime())) return dateStr;

  return date.toISOString();
};

export const transformQuestion = (apiQuestion: any, idx: number): BaseQuestion => ({
  index: idx + 1,
  question: apiQuestion.question,
  options: Object.fromEntries(
    (apiQuestion.options ?? []).map((o: { key: string; text: string }) => [o.key, o.text])
  ),
  id: apiQuestion._id,
});

