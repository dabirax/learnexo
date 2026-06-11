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
  answers,
}) => {
  const navigate = useNavigate();
  const [submitCount, setSubmitCount] = useState(0);
  const { subject, gradeClass } = useParams<{
    subject: string;
    gradeClass: string;
  }>();

  const {
    mutate: submitAssessment,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["getAssessmentScore"],
    mutationFn: getAssessmentScore,
    onSuccess: (data) => {
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
