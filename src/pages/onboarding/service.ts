import type { Option } from "../../utils/types/baseTypes";

export const roleOptions: Option[] = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
  { value: "gaurdian", label: "Gaurdian" },
  { value: "administrator", label: "Administrator" },
];

export const genderOptions: Option[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export const languageOptions: Option[] = [
  { value: "english", label: "English" },
  { value: "yoruba", label: "Yoruba" },
  { value: "hausa", label: "Hausa" },
  { value: "igbo", label: "Igbo" },
];

export const subjectsOptions: Option[] = [
  { value: "maths", label: "Maths" },
  { value: "english", label: "English" },
];

export const gradeOptions: Option[] = [
  { label: "75% – 100%", value: "A" },
  { label: "65% – 74%", value: "B" },
  { label: "60% – 64%", value: "C" },
  { label: "45% – 49%", value: "D" },
  { label: "40% – 44%", value: "E" },
  { label: "0% – 39%", value: "F" },
  { label: "Nil", value: "nil" },
];

export const classOptions: Option[] = [
  { label: "JSS One", value: "JSS 1" },
  { label: "JSS Two", value: "JSS 2" },
  { label: "JSS Three", value: "JSS 3" },
  { label: "SSS One", value: "SSS 1" },
  { label: "SSS Two", value: "SSS 2" },
  { label: "SSS Three", value: "SSS 3" },
];

export const learningStyleOptions: Option[] = [
  { label: "Visual", value: "visual" },
  { label: "Auditory", value: "auditory" },
  { label: "Reading and writing", value: "reading-writing" },
  { label: "Kinesthetic", value: "kinesthetic" },
];

export const handleSelect = (
  questionIndex: number,
  answer: string,
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>
) => {
  setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
};
