import MainButton from "@/components/ui/MainButton";
import Spinner from "@/components/ui/Spinner";
import { setLocalStorage } from "@/utils/session";
import { submitAssessmentRequest } from "@/utils/queries/assessment";
import type { Answer } from "@/utils/types/baseTypes";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type NavigationProps = {
  idInt: number;
  numberOfQuestions: number;
  answers: Answer[];
  assessmentId: string;
  subject: string;
  gradeClass: string;
  onManualSubmit?: () => void;
  isSubmitting?: boolean;
};

const Navigation: React.FC<NavigationProps> = ({
  idInt,
  numberOfQuestions,
  answers,
  assessmentId,
  subject,
  gradeClass,
  onManualSubmit,
  isSubmitting,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const suffix = queryString ? `?${queryString}` : "";
  const [submitCount, setSubmitCount] = useState(0);

  const {
    mutate: submitAssessment,
    isPending,
  } = useMutation<{
    recommendations?: Array<{
      feedback: string;
      recommend_for: string;
      recommended_topic: string;
    }>;
  }>({
    mutationKey: ["submitAssessment"],
    mutationFn: () => submitAssessmentRequest({ assessmentId, answers }),
    onSuccess: (data) => {
      if (data.recommendations) {
        setLocalStorage("assessment_reccs", data.recommendations);
      }
      toast.success("Assessment completed successfully");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleSubmit = () => {
    if (submitCount < 1) {
      setSubmitCount(submitCount + 1);
      toast.warning("You cannot edit your answers after this step");
      return;
    }

    if (onManualSubmit) {
      onManualSubmit();
    } else {
      submitAssessment();
    }
  };

  return (
    <div className="flex gap-4 flex-col md:flex-row mlg:flex-col lgd:flex-row justify-between">
      {idInt > 1 && (
        <div className="md:mr-auto mlg:mr-0 lgd:mr-auto">
          <MainButton
            white
            onClick={() => navigate(`/assessment/${subject}/${gradeClass}/${idInt - 1}${suffix}`)}
          >
            Previous Question
          </MainButton>
        </div>
      )}

      {idInt < numberOfQuestions && (
        <div className="md:ml-auto mlg:ml-0 lgd:ml-auto">
          <MainButton
            onClick={() => navigate(`/assessment/${subject}/${gradeClass}/${idInt + 1}${suffix}`)}
          >
            Next Question
          </MainButton>
        </div>
      )}

      {idInt === numberOfQuestions && (
        <div className="md:ml-auto mlg:ml-0 lgd:ml-auto">
          <MainButton onClick={handleSubmit}>
            {isPending || isSubmitting ? <Spinner /> : "Submit Answers And Proceed"}
          </MainButton>
        </div>
      )}
    </div>
  );
};

export default Navigation;
