import Question from "@/components/ui/Question";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { transformQuestion } from "@/utils/funcs";
import TestInstruction from "@/components/ui/TestInstruction";
import MainButton from "@/components/ui/MainButton";
import StartPage from "./StartPage";
import CountdownPage from "./CountdownPage";
import Spinner from "@/components/ui/Spinner";
import { getAssessmentRequest, submitAssessmentRequest } from "@/utils/queries/assessment";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Answer } from "@/utils/types/baseTypes";
import Navigation from "./Navigation";
import { useEffect, useState, useCallback } from "react";
import { Clock, BrainCircuit, Zap, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { setLocalStorage } from "@/utils/session";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";

const ASSESSMENT_DURATION = 15 * 60;

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const PROCESSING_STEPS = [
  "Marking your answers...",
  "Analyzing your performance...",
  "Detecting weak and strong topics...",
  "Generating personalized recommendations...",
];

const Assessment = () => {
  useDocumentTitle("Assessment");
  const { subject, gradeClass, id } = useParams<{
    subject: string;
    gradeClass: string;
    id: string;
  }>();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const topic = searchParams.get("topic") ?? undefined;
  const idInt = parseInt(id ?? "");
  const navigate = useNavigate();
  const queryString = searchParams.toString();
  const suffix = queryString ? `?${queryString}` : "";

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(ASSESSMENT_DURATION);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const {
    data: assessmentQuestions,
    isPending,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["getAssessmentRequest", subject, gradeClass, category, topic],
    queryFn: ({ queryKey }) => {
      const [, subject, gradeClass, category, topic] = queryKey;
      return getAssessmentRequest({
        subject: subject as string,
        gradeClass: gradeClass as string,
        category: category as string | undefined,
        topic: topic as string | undefined,
      });
    },
    staleTime: 1000 * 60 * 5,
  });

  // Restore persisted answers and timer
  useEffect(() => {
    if (assessmentQuestions?.assessmentId) {
      const savedAnswers = sessionStorage.getItem(
        `assessment_answers_${assessmentQuestions.assessmentId}`,
      );
      const savedTimer = sessionStorage.getItem(
        `assessment_timer_${assessmentQuestions.assessmentId}`,
      );
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers) as Answer[]);
      }
      if (savedTimer) {
        const remaining = parseInt(savedTimer, 10);
        if (!isNaN(remaining) && remaining > 0) {
          setTimeLeft(remaining);
        }
      }
    }
  }, [assessmentQuestions?.assessmentId]);

  // Persist answers
  useEffect(() => {
    if (assessmentQuestions?.assessmentId && answers.length > 0) {
      sessionStorage.setItem(
        `assessment_answers_${assessmentQuestions.assessmentId}`,
        JSON.stringify(answers),
      );
    }
  }, [answers, assessmentQuestions?.assessmentId]);

  // Persist timer
  useEffect(() => {
    if (assessmentQuestions?.assessmentId && started && !isSubmitting && !isDone) {
      sessionStorage.setItem(
        `assessment_timer_${assessmentQuestions.assessmentId}`,
        String(timeLeft),
      );
    }
  }, [timeLeft, assessmentQuestions?.assessmentId, started, isSubmitting, isDone]);

  // Countdown before first question
  useEffect(() => {
    if (!started) return;
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, countdown]);

  // Assessment timer
  useEffect(() => {
    if (!started || countdown > 0 || isSubmitting || isDone) return;

    if (timeLeft <= 0) {
      toast.info("Time's up! Submitting your answers...");
      handleAutoSubmit();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [started, countdown, timeLeft, isSubmitting, isDone]);

  // Processing animation
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

  const submitMutation = useMutation({
    mutationFn: () =>
      submitAssessmentRequest({
        assessmentId: assessmentQuestions!.assessmentId,
        answers,
      }),
    onSuccess: (data) => {
      setIsDone(true);
      if (data.recommendations) {
        setLocalStorage("assessment_reccs", data.recommendations);
      }
      toast.success("Assessment completed!");
      // Clean up session storage
      if (assessmentQuestions?.assessmentId) {
        sessionStorage.removeItem(`assessment_answers_${assessmentQuestions.assessmentId}`);
        sessionStorage.removeItem(`assessment_timer_${assessmentQuestions.assessmentId}`);
      }
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    },
    onError: (err: Error) => {
      setIsSubmitting(false);
      toast.error(err.message || "Failed to submit assessment");
    },
  });

  const handleAutoSubmit = useCallback(() => {
    if (isSubmitting || isDone) return;
    setIsSubmitting(true);
    submitMutation.mutate();
  }, [isSubmitting, isDone, submitMutation]);

  const handleManualSubmit = useCallback(() => {
    if (isSubmitting || isDone) return;
    setIsSubmitting(true);
    submitMutation.mutate();
  }, [isSubmitting, isDone, submitMutation]);

  if (!id || isNaN(idInt) || !subject || !gradeClass)
    return (
      <div className="h-full flex flex-col items-center justify-center max-w-sm mx-auto gap-6">
        <p className="text-2xl font-semibold">Question not found</p>
        <MainButton onClick={() => navigate(-1)}>Go Back</MainButton>
      </div>
    );

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error)
    return (
      <div className="h-full flex flex-col items-center justify-center max-w-sm mx-auto gap-6">
        <p className="text-2xl font-semibold">
          An error has occurred: {error.message}
        </p>
        <MainButton onClick={() => navigate(-1)}>Go Back</MainButton>
      </div>
    );

  if (
    !isSuccess ||
    !assessmentQuestions.questions ||
    !Array.isArray(assessmentQuestions.questions)
  ) {
    return (
      <div className="h-full flex flex-col items-center justify-center max-w-sm mx-auto gap-6">
        <p className="text-2xl font-semibold">No questions found</p>
        <MainButton onClick={() => navigate(-1)}>Go Back</MainButton>
      </div>
    );
  }

  const questions = assessmentQuestions.questions.map(transformQuestion);
  const numberOfQuestions = questions.length;
  const question = questions[idInt - 1];

  // Processing / Submitting screen
  if (isSubmitting || isDone) {
    const statusMessages = [
      ...PROCESSING_STEPS,
      "Assessment complete! Redirecting to your dashboard...",
    ];

    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-12 animate-in fade-in duration-700 bg-white">
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

        <div className="space-y-6 w-full max-w-sm px-4">
          <div className="space-y-2">
            <h2 className="text-2xl mlg:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isDone ? "Assessment Complete!" : "Processing your results"}
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
  }

  if (!started) {
    return (
      <StartPage
        subject={subject ?? ""}
        gradeClass={gradeClass ?? ""}
        category={category}
        topic={topic}
        numberOfQuestions={numberOfQuestions}
        setStarted={setStarted}
      />
    );
  }

  if (countdown > 0) {
    return <CountdownPage countdown={countdown} />;
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="mb-4">
          Something went wrong with this question! Kindly proceed
        </p>
        <Navigation
          idInt={idInt}
          numberOfQuestions={numberOfQuestions}
          answers={answers}
          assessmentId={assessmentQuestions.assessmentId}
          subject={subject ?? ""}
          gradeClass={gradeClass ?? ""}
          onManualSubmit={handleManualSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  const questionObject = {
    ...question,
    index: idInt,
    selected:
      answers.find((answer) => answer.questionId === question.id)?.selected ?? "",
    setSelected: (val: string) =>
      setAnswers((prev) => {
        const filtered = prev.filter(
          (answer) => answer.questionId !== question.id
        );
        return [...filtered, { questionId: question.id, selected: val }];
      }),
  };

  const timerUrgent = timeLeft <= 60;
  const timerWarning = timeLeft <= 300 && !timerUrgent;

  return (
    <div className="flex h-screen w-full">
      {/* Left branding panel — hidden on small screens */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[35%] bg-slate-950 flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10">
          <span className="text-white font-bold text-xl tracking-tight">LearNexo</span>
        </div>

        <div className="flex flex-col relative z-10 gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 w-fit">
            <Sparkles className="text-violet-400" size={16} />
            <span className="text-xs font-bold uppercase tracking-wider text-violet-300">AI-Powered Assessment</span>
          </div>

          <h2 className="text-white font-bold text-3xl xl:text-4xl leading-tight tracking-tight">
            Focus mode active
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">
              No distractions.
            </span>
          </h2>

          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Stay focused. Every answer helps us build your personalized learning path.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-slate-500 text-sm">
          <Clock size={14} />
          <span>{numberOfQuestions} questions</span>
        </div>
      </div>

      {/* Right question panel */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        {/* Top bar with timer and progress */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-500">
              Question {idInt} / {numberOfQuestions}
            </span>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 transition-all duration-500"
                style={{ width: `${(idInt / numberOfQuestions) * 100}%` }}
              />
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border-2 transition-colors ${
              timerUrgent
                ? "text-rose-600 bg-rose-50 border-rose-200 animate-pulse"
                : timerWarning
                  ? "text-amber-600 bg-amber-50 border-amber-200"
                  : "text-slate-400 bg-slate-100 border-slate-100"
            }`}
          >
            <Clock size={12} />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-12 lg:py-10">
          <div className="max-w-2xl mx-auto flex flex-col gap-8">
            <TestInstruction
              numberOfQuestions={numberOfQuestions}
              currentIndex={idInt}
            >
              From the multiple choice questions, you are to choose answers between
              option A - E
            </TestInstruction>

            <Question questionObject={questionObject} />

            {/* Inline navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              {idInt > 1 ? (
                <button
                  type="button"
                  onClick={() => navigate(`/assessment/${subject}/${gradeClass}/${idInt - 1}${suffix}`)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-900 transition-all group"
                >
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              {idInt < numberOfQuestions ? (
                <button
                  type="button"
                  onClick={() => navigate(`/assessment/${subject}/${gradeClass}/${idInt + 1}${suffix}`)}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-violet-600 transition-all shadow-lg shadow-slate-200 group"
                >
                  Next
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleManualSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-500 transition-all shadow-lg shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? <Spinner /> : (
                    <>
                      Submit
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
