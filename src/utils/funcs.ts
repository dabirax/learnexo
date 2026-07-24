import type { BaseQuestion } from "./types/baseTypes";

export const removeAndReturn = <T extends Record<string, unknown>>(
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

export const transformQuestion = (apiQuestion: unknown, idx: number): BaseQuestion => {
  const q = apiQuestion as Record<string, unknown>;
  const rawOptions = q.options;
  let mappedOptions: Record<string, string> = {};

  if (Array.isArray(rawOptions)) {
    mappedOptions = Object.fromEntries(
      rawOptions
        .filter((o): o is Record<string, string> => typeof o === "object" && o !== null)
        .map((o) => [String(o.key ?? ""), String(o.text ?? "")]),
    );
  } else if (typeof rawOptions === "object" && rawOptions !== null) {
    mappedOptions = Object.fromEntries(
      Object.entries(rawOptions as Record<string, unknown>).map(([k, v]) => [
        k,
        String(v ?? ""),
      ]),
    );
  }

  return {
    index: idx + 1,
    question: String(q.question ?? ""),
    options: mappedOptions,
    id: String(q._id ?? q.id ?? ""),
  };
};

