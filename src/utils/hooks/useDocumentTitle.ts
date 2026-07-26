import { useEffect } from "react";

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const original = document.title;
    document.title = title ? `${title} | LearNexo` : "LearNexo";
    return () => {
      document.title = original;
    };
  }, [title]);
};
