import { useNavigate, useParams } from "react-router-dom";
import HeaderText from "../../components/HeaderText";
import TestInstruction from "../../../../components/ui/TestInstruction";
import Question from "../../../../components/ui/Question";
import { useState } from "react";
import type { BaseQuestion } from "../../../../utils/types/baseTypes";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/Spinner";
import { transformQuestion } from "@/utils/funcs"; // Assumed handleSelect moved to funcs
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { handleSelect } from "../../service";

const QuestionnaireTest = () => {
  const { id } = useParams<{ id: string }>();
  const idInt = parseInt(id ?? "");
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // const {
  //   data: questions,
  //   isPending,
  //   isSuccess,
  //   error,
  // } = useQuery({
  //   queryKey: ["questionnairequestions"],
  //   queryFn: questionnairesRequest,
  //   staleTime: 1000 * 60 * 5,
  // });

  // Inside QuestionnaireTest.tsx
  const {
    data: questions,
    isPending,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["questionnairequestions"],
    queryFn: async () => {
      // Simulate a 1-second network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        data: [
          {
            questionNumber: 1, 
            question: "How do you prefer to learn new complex topics?",
            options: {
              a: "Watching a detailed video tutorial",
              b: "Reading a comprehensive textbook",
              c: "Hands-on experimentation",
              d: "Discussing with a peer group",
              e: "Listening to an expert lecture",
            },
            id: 1
          },
          {
            questionNumber: 2, 
            question: "When studying for a test, what helps you most?",
            options: {
              a: "Flashcards",
              b: "Mind maps",
              c: "Practice exams",
              d: "Re-writing notes",
              e: "Explaining it to someone else",
            },
            id: 2
          },
        ],
      };
    },
  });

  if (!id || isNaN(idInt))
    return (
      <div className="p-10 text-slate-500 font-medium">Question not found</div>
    );
  if (isPending)
    return (
      <div className="flex justify-center p-20 flex-col items-center gap-6">
        <Spinner dark />
        <p className="text-lg font-semibold text-center">
          Loading your personalized assessment test ...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="text-rose-500 p-10 font-medium">
        Error: {error.message}
      </div>
    );

  if (!isSuccess || !questions.data || !Array.isArray(questions.data)) {
    return (
      <div className="p-10 text-slate-500 font-medium">
        No questions available.
      </div>
    );
  }

  const numberOfQuestions = questions.data.length;
  const rawQuestion = questions.data
    .map(transformQuestion)
    .find((q: BaseQuestion) => q.index === idInt);

  if (!rawQuestion) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <p className="text-slate-600 bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 text-center">
          This question isn't ready yet. Let's move to the next one!
        </p>
        <Navigation idInt={idInt} numberOfQuestions={numberOfQuestions} />
      </div>
    );
  }

  const questionObject = {
    ...rawQuestion,
    index: idInt,
    selected: answers[idInt] ?? "",
    setSelected: (value: string) => handleSelect(idInt, value, setAnswers),
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <HeaderText title="Learning Questionnaire" />
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-violet-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${(idInt / numberOfQuestions) * 100}%` }}
          />
        </div>
      </div>

      <TestInstruction numberOfQuestions={numberOfQuestions}>
        From the multiple choice questions, you are to choose answer between
        option A - E
      </TestInstruction>

      <div className="bg-white/50 rounded-[2rem] border-2 border-slate-100 p-6 md:p-10 shadow-sm">
        <Question questionObject={questionObject} />
      </div>

      <Navigation idInt={idInt} numberOfQuestions={numberOfQuestions} />
    </div>
  );
};

const Navigation: React.FC<{ idInt: number; numberOfQuestions: number }> = ({
  idInt,
  numberOfQuestions,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center pt-6">
      <div className="w-full md:w-auto">
        {idInt > 1 && (
          <button
            onClick={() => navigate(`../questionnairetest/${idInt - 1}`)}
            className="w-full md:w-auto px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-2 group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Previous
          </button>
        )}
      </div>

      <div className="w-full md:w-auto">
        {idInt < numberOfQuestions ? (
          <button
            onClick={() => navigate(`../questionnairetest/${idInt + 1}`)}
            className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-violet-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 group"
          >
            Next
            <ChevronRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        ) : (
          <button
            onClick={() => {
              toast.warning("Finalizing your assessment profile...");
              setTimeout(() => navigate(`../../../dashboard`), 1500);
            }}
            className="w-full md:w-auto px-8 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 group"
          >
            <CheckCircle size={20} />
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireTest;
