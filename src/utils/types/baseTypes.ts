export type ChildrenProps = {
  children?: React.ReactNode;
};

export type Option = {
  value: string;
  label: string;
};

export type BaseQuestion = {
  index: number;
  question: string;
  options: Record<string, string>;
  id: string;
};

export type Headers = {
  "Access-Control-Allow-Credentials": string;
  Authorization: string;
  "Content-Type"?: string;
};

export type Answer = {
  selected: string;
  questionId: string;
};

export type Recommendation = {
  feedback: string;
  recommend_for: string;
  recommended_topic: string;
};
