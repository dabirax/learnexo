import MainButton from "@/components/ui/MainButton";
import Spinner from "@/components/ui/Spinner";
import { setLocalStorage } from "@/utils/session";
import { getAssessmentScore } from "@/utils/queries/assessment";
import type { Answer } from "@/utils/types/baseTypes";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

type NavigationProps = {
  idInt: number;
  numberOfQuestions: number;
  answers: Answer[];
};

const Navigation: React.FC<NavigationProps> = ({
  idInt,
  numberOfQuestions,
  //   answers,
}) => {
  const navigate = useNavigate();
  const [submitCount, setSubmitCount] = useState(0);
  const { subject, gradeClass } = useParams<{
    subject: string;
    gradeClass: string;
  }>();

  const answers = [
    {
      questionId: "6890618e44dcc0ada5d032de",
      answer: "B",
    },
    {
      questionId: "6890618e44dcc0ada5d032e0",
      answer: "C",
    },
    {
      questionId: "6890618e44dcc0ada5d032e3",
      answer: "B",
    },
    {
      questionId: "6890618e44dcc0ada5d032e7",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d032ea",
      answer: "C",
    },
    {
      questionId: "6890618e44dcc0ada5d032f1",
      answer: "C",
    },
    {
      questionId: "6890618e44dcc0ada5d032f3",
      answer: "D",
    },
    {
      questionId: "6890618e44dcc0ada5d032f4",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d032f7",
      answer: "C",
    },
    {
      questionId: "6890618e44dcc0ada5d032fa",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d032fe",
      answer: "B",
    },
    {
      questionId: "6890618e44dcc0ada5d03302",
      answer: "C",
    },
    {
      questionId: "6890618e44dcc0ada5d03308",
      answer: "C",
    },
    {
      questionId: "6890618e44dcc0ada5d0330c",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d03315",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d032dc",
      answer: "B",
    },
    {
      questionId: "6890618e44dcc0ada5d032e2",
      answer: "B",
    },
    {
      questionId: "6890618e44dcc0ada5d032e5",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d032e6",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d032ec",
      answer: "D",
    },
    {
      questionId: "6890618e44dcc0ada5d032f2",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d032f8",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d032ff",
      answer: "D",
    },
    {
      questionId: "6890618e44dcc0ada5d03304",
      answer: "D",
    },
    {
      questionId: "6890618e44dcc0ada5d03309",
      answer: "B",
    },
    {
      questionId: "6890618e44dcc0ada5d0330a",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d0330d",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d03312",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d03313",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d03314",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d032dd",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d032df",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d032e9",
      answer: "C",
    },
    {
      questionId: "6890618e44dcc0ada5d032ed",
      answer: "B",
    },
    {
      questionId: "6890618e44dcc0ada5d032ef",
      answer: "B",
    },
    {
      questionId: "6890618e44dcc0ada5d032f0",
      answer: "D",
    },
    {
      questionId: "6890618e44dcc0ada5d032f9",
      answer: "D",
    },
    {
      questionId: "6890618e44dcc0ada5d032fb",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d03300",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d03306",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d03310",
      answer: "D",
    },
    {
      questionId: "6890618e44dcc0ada5d03316",
      answer: "B",
    },
    {
      questionId: "6890618e44dcc0ada5d032e1",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d032e8",
      answer: "B",
    },
    {
      questionId: "6890618e44dcc0ada5d032eb",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d032ee",
      answer: "D",
    },
    {
      questionId: "6890618e44dcc0ada5d032f5",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d032f6",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d032fc",
      answer: "C",
    },
    {
      questionId: "6890618e44dcc0ada5d032fd",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d03301",
      answer: "C",
    },
    {
      questionId: "6890618e44dcc0ada5d03303",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d03305",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d03307",
      answer: "D",
    },
    {
      questionId: "6890618e44dcc0ada5d0330b",
      answer: "A",
    },
    {
      questionId: "6890618e44dcc0ada5d0330e",
      answer: "B",
    },
    {
      questionId: "6890618e44dcc0ada5d0330f",
      answer: "E",
    },
    {
      questionId: "6890618e44dcc0ada5d03311",
      answer: "A",
    },
  ];

  const {
    mutate: submitAssessment,
    // data: assessmentResults,
    isError,
    isPending,
    // isSuccess,
    error,
  } = useMutation({
    mutationKey: ["getAssessmentScore", answers],
    mutationFn: getAssessmentScore,
    onSuccess: (data) => {
      console.log(data);

      setLocalStorage("assessment_reccs", data.data.recommendations);

      toast.success("Assessment completed successfully");

      setTimeout(() => {
        navigate("../../../dashboard");
      }, 2000);
    },

    onError: (err: any) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleSubmit = () => {
    if (submitCount < 1) {
      setSubmitCount(submitCount + 1);
      toast.warning("You cannot edit your answers after this step");
      return;
    }

    submitAssessment(answers);
  };

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  return (
    <div className="flex gap-4 flex-col md:flex-row mlg:flex-col lgd:flex-row justify-between">
      {idInt > 1 && (
        <div className="md:mr-auto mlg:mr-0 lgd:mr-auto">
          <MainButton
            white
            onClick={() => navigate(`../${subject}/${gradeClass}/${idInt - 1}`)}
          >
            Previous Question
          </MainButton>
        </div>
      )}

      {idInt < numberOfQuestions && (
        <div className="md:ml-auto mlg:ml-0 lgd:ml-auto">
          <MainButton
            onClick={() => navigate(`../${subject}/${gradeClass}/${idInt + 1}`)}
          >
            Next Question
          </MainButton>
        </div>
      )}

      {idInt === numberOfQuestions && (
        <div className="md:ml-auto mlg:ml-0 lgd:ml-auto">
          <MainButton onClick={handleSubmit}>
            {isPending ? <Spinner /> : "Submit Answers And Proceed"}
          </MainButton>
        </div>
      )}
    </div>
  );
};

export default Navigation;
