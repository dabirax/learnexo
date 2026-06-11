import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import {
  questionnairesRequest,
  submitQuestionnaireRequest,
} from "@/services/onboarding/requests";

const Questionnaire = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data, isPending, error } = useQuery({
    queryKey: ["questionnaireQuestions"],
    queryFn: questionnairesRequest,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: submitQuestionnaireRequest,
    onSuccess: () => {
      toast.success("Assessment complete! Please log in to continue.");
      setTimeout(() => navigate("/onboarding/auth/login"), 1000);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-6 py-20">
        <Spinner dark />
        <p className="text-base font-semibold text-slate-600 text-center">
          Loading your learning questionnaire...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-rose-500 font-medium text-sm">
        {error.message}
      </div>
    );
  }

  if (!data?.questions?.length) {
    return (
      <div className="p-10 text-slate-500 font-medium text-sm">
        No questions available. Please try again later.
      </div>
    );
  }

  const questions = data.questions;
  const total = questions.length;
  const current = questions[currentIndex];

  const optionsRecord = current.options.reduce<Record<string, string>>(
    (acc, opt) => {
      acc[opt.key] = opt.text;
      return acc;
    },
    {},
  );

  const selected = answers[current.questionNumber] ?? "";

  const handleSelect = (key: string) => {
    setAnswers((prev) => ({ ...prev, [current.questionNumber]: key }));
  };

  const handleSubmit = () => {
    submit({
      answers: questions.map((q) => ({
        questionNumber: q.questionNumber,
        selected: answers[q.questionNumber] ?? "",
      })),
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Learning Style Questionnaire
          </h1>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
            Question {currentIndex + 1} – {total}
          </span>
        </div>

        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-violet-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>

        <p className="text-sm text-slate-500">
          Choose the option that best describes how you learn. There are no right
          or wrong answers.
        </p>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-[2rem] border-2 border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold shrink-0">
            {currentIndex + 1}
          </div>
          <p className="text-base font-semibold text-slate-800 pt-1 leading-snug">
            {current.question}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {Object.entries(optionsRecord).map(([key, text]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              className={`flex items-start gap-3 w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                selected === key
                  ? "border-violet-500 bg-violet-50"
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 uppercase transition-colors ${
                  selected === key
                    ? "bg-violet-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {key}
              </span>
              <span
                className={`text-sm font-medium leading-snug ${
                  selected === key ? "text-violet-700" : "text-slate-700"
                }`}
              >
                {text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-2">
        <div>
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => i - 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-900 transition-all group"
            >
              <ChevronLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Previous
            </button>
          )}
        </div>

        <div>
          {currentIndex < total - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-violet-600 transition-all shadow-lg shadow-slate-200 group"
            >
              Next
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-500 transition-all shadow-lg shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <Spinner />
              ) : (
                <>
                  <CheckCircle size={18} />
                  Submit Test
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
