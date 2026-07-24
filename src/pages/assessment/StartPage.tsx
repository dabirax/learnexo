import { Clock, ListChecks, ArrowRight, Brain, ChevronRight } from "lucide-react";
import { SUBJECT_LABELS, classLabel } from "@/utils/lib/assessmentCatalog";

const StartPage = ({
  subject,
  gradeClass,
  category,
  topic,
  numberOfQuestions,
  setStarted,
}: {
  subject: string;
  gradeClass: string;
  category?: string;
  topic?: string;
  numberOfQuestions: number;
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const isObjectId = /^[0-9a-f]{24}$/i.test(subject);
  const subjectLabel = isObjectId
    ? "Subject"
    : (SUBJECT_LABELS[subject] ?? subject.replace(/-/g, " "));
  const classDisplay = classLabel(gradeClass);

  const scopeLabel = topic
    ? topic.replace(/_/g, " ")
    : category
      ? category.replace(/_/g, " ")
      : null;

  const title = scopeLabel
    ? `${classDisplay} ${subjectLabel} — ${scopeLabel} Assessment`
    : `${classDisplay} ${subjectLabel} Assessment`;

  const scopeDescription = topic
    ? `covering ${topic.replace(/_/g, " ")} topics`
    : category
      ? `covering ${category.replace(/_/g, " ")} topics`
      : "covering grammar, comprehension, vocabulary, oral, and writing";

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-slate-900 capitalize">
          {title}
        </h1>
        <p className="text-sm text-slate-500">
          Answer all questions carefully. Your results will help us identify your
          strong and weak topics.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-slate-100 p-6 md:p-8 shadow-sm space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-widest text-violet-600">
          Before you begin
        </h3>
        <ul className="space-y-4 text-sm text-slate-600">
          <li className="flex items-start gap-3">
            <Clock size={18} className="text-violet-500 shrink-0 mt-0.5" />
            <span>
              You will answer <strong>{numberOfQuestions} questions</strong>{" "}
              {scopeDescription}.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ListChecks size={18} className="text-violet-500 shrink-0 mt-0.5" />
            <span>
              Use <strong>Previous</strong> and <strong>Next</strong> to move
              between questions. You can change your answer before submitting.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Brain size={18} className="text-violet-500 shrink-0 mt-0.5" />
            <span>
              After submission, you will receive a personalized insight showing
              your score, strong topics, and areas to improve.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ArrowRight size={18} className="text-violet-500 shrink-0 mt-0.5" />
            <span>
              Once you click <strong>Start</strong>, a short countdown will
              begin before the first question appears.
            </span>
          </li>
        </ul>
      </div>

      <button
        type="button"
        onClick={() => setStarted(true)}
        className="self-center flex items-center gap-2 px-10 py-3.5 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-500 transition-all shadow-lg shadow-violet-200 group"
      >
        Start
        <ChevronRight
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );
};

export default StartPage;
