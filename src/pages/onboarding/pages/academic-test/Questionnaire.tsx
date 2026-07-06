import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  ListChecks,
  Repeat,
  BrainCircuit,
  Sparkles,
  Zap,
} from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import {
  questionnairesRequest,
  submitQuestionnaireRequest,
} from "@/services/onboarding/requests";

const QUESTIONNAIRE_DURATION = 15 * 60;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const PROCESSING_STEPS = [
  "Marking your answers...",
  "Calculating your cognitive score...",
  "Detecting your learning style...",
  "Updating your learning profile...",
];

const IntroScreen = ({
  totalQuestions,
  retake,
  onStart,
}: {
  totalQuestions: number;
  retake: boolean;
  onStart: () => void;
}) => {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto px-4 py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Learning Style Questionnaire
        </h1>
        <p className="text-sm text-slate-500">
          {retake
            ? "Retake this short assessment to refresh your learning profile with up-to-date results."
            : "A few quick questions to help us personalize your learning experience."}
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
              You have <strong>15 minutes</strong> to answer{" "}
              <strong>{totalQuestions} questions</strong>. The timer starts as
              soon as you click Start.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ListChecks size={18} className="text-violet-500 shrink-0 mt-0.5" />
            <span>
              Some questions test how you think and solve problems; others
              explore how you prefer to learn. Go with whatever feels most
              natural — there's no "wrong" answer for learning-style questions.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Repeat size={18} className="text-violet-500 shrink-0 mt-0.5" />
            <span>
              You can move between questions with Previous and Next before
              submitting. If time runs out, we'll automatically submit your
              answers as they are.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Sparkles size={18} className="text-violet-500 shrink-0 mt-0.5" />
            <span>
              {retake
                ? "When you submit, we'll recalculate your cognitive score and learning style, replacing your current learning profile."
                : "When you submit, we'll calculate your cognitive score and learning style, then build your personalized learning profile."}
            </span>
          </li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="self-center flex items-center gap-2 px-10 py-3.5 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-500 transition-all shadow-lg shadow-violet-200 group"
      >
        Start Questionnaire
        <ChevronRight
          size={18}
          className="group-hover:translate-x-1 transition-transform"
        />
      </button>
    </div>
  );
};

const ProcessingScreen = ({
  progress,
  statusIndex,
  done,
  retake,
}: {
  progress: number;
  statusIndex: number;
  done: boolean;
  retake: boolean;
}) => {
  const statusMessages = [
    ...PROCESSING_STEPS,
    retake
      ? "Assessment complete! Redirecting to your profile..."
      : "Assessment complete! Redirecting to the login page...",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-12 animate-in fade-in duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-violet-500/20 blur-[60px] rounded-full animate-pulse scale-150" />
        <div className="absolute inset-0 bg-emerald-400/10 blur-[40px] rounded-full animate-pulse delay-700 scale-110" />

        <div className="relative z-10 w-32 h-32 mlg:w-48 mlg:h-48 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-slate-100 group transition-transform hover:scale-105">
          <BrainCircuit
            size={64}
            className="text-violet-600 animate-bounce-slow"
          />

          <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-2 rounded-xl shadow-lg animate-bounce delay-150">
            <Zap size={20} />
          </div>
          <div className="absolute -bottom-2 -left-6 bg-slate-900 text-white p-2 rounded-xl shadow-lg animate-bounce delay-300">
            <Sparkles size={18} />
          </div>
        </div>
      </div>

      <div className="space-y-6 w-full max-w-sm">
        <div className="space-y-2">
          <h2 className="text-2xl mlg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {done ? "Assessment Complete!" : "Processing your results"}
          </h2>
          <p className="text-violet-600 font-bold text-sm uppercase tracking-[0.2em] animate-pulse">
            {statusMessages[statusIndex]}
          </p>
        </div>

        <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
          <span>AI Engine Active</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>
    </div>
  );
};

const Questionnaire = ({ retake = false }: { retake?: boolean }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(QUESTIONNAIRE_DURATION);
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const { data, isPending, error } = useQuery({
    queryKey: ["questionnaireQuestions"],
    queryFn: questionnairesRequest,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: submitQuestionnaireRequest,
    onSuccess: () => {
      setIsDone(true);
      if (retake) {
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        setTimeout(() => {
          toast.success("Your learning profile has been updated!");
          navigate("/dashboard/profile");
        }, 1200);
      } else {
        setTimeout(() => {
          toast.success("Assessment complete! Please log in to continue.");
          navigate("/onboarding/auth/login");
        }, 1200);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const submitAnswers = useCallback(() => {
    const questions = data?.questions ?? [];
    submit({
      answers: questions.map((q) => ({
        questionNumber: q.questionNumber,
        selected: answers[q.questionNumber] ?? "",
      })),
    });
  }, [data?.questions, answers, submit]);

  useEffect(() => {
    if (!started || !data?.questions?.length || isSubmitting || isDone) return;

    if (timeLeft <= 0) {
      toast.info("Time's up! Submitting your answers...");
      submitAnswers();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [started, timeLeft, data?.questions?.length, isSubmitting, isDone, submitAnswers]);

  useEffect(() => {
    if (isDone) {
      setProgress(100);
      setStatusIndex(PROCESSING_STEPS.length);
      return;
    }

    if (!isSubmitting) {
      setProgress(0);
      setStatusIndex(0);
      return;
    }

    const progressTimer = setInterval(() => {
      setProgress((old) => {
        if (old >= 90) return old;
        const diff = Math.random() * 15;
        return Math.min(old + diff, 90);
      });
    }, 600);

    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => Math.min(prev + 1, PROCESSING_STEPS.length - 1));
    }, 1800);

    return () => {
      clearInterval(progressTimer);
      clearInterval(statusTimer);
    };
  }, [isSubmitting, isDone]);

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

  if (isSubmitting || isDone) {
    return (
      <ProcessingScreen
        progress={progress}
        statusIndex={statusIndex}
        done={isDone}
        retake={retake}
      />
    );
  }

  if (!started) {
    return (
      <IntroScreen
        totalQuestions={total}
        retake={retake}
        onStart={() => setStarted(true)}
      />
    );
  }

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
    submitAnswers();
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700",
        retake && "max-w-3xl mx-auto px-6 pt-10 pb-16",
      )}
    >
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Learning Style Questionnaire
          </h1>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border-2 transition-colors",
                timeLeft <= 60
                  ? "text-rose-600 bg-rose-50 border-rose-200 animate-pulse"
                  : timeLeft <= 300
                    ? "text-amber-600 bg-amber-50 border-amber-200"
                    : "text-slate-400 bg-slate-100 border-slate-100",
              )}
            >
              <Clock size={12} />
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
              Question {currentIndex + 1} – {total}
            </span>
          </div>
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
