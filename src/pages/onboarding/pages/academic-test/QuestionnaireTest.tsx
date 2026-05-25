import { useNavigate, useParams } from "react-router-dom";
import HeaderText from "../../components/HeaderText";
import { handleSelect } from "../../service";
import TestInstruction from "../../../../components/ui/TestInstruction";
import Question from "../../../../components/ui/Question";
import { useState } from "react";
import type { BaseQuestion } from "../../../../utils/types/baseTypes";
import MainButton from "../../../../components/ui/MainButton";
import { useQuery } from "@tanstack/react-query";
import { questionnairesRequest } from "@/utils/queries/auth";
import Spinner from "@/components/ui/Spinner";
import { transformQuestion } from "@/utils/funcs";
import { toast } from "sonner";

const QuestionnaireTest = () => {
  const { id } = useParams<{ id: string }>();
  const idInt = parseInt(id ?? "");
  // const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const {
    data: questions,
    isPending,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["questionnairequestions"],
    queryFn: questionnairesRequest,
    staleTime: 1000 * 60 * 5,
  });

  if (!id || isNaN(idInt)) {
    return <div>Questions not found</div>;
  }

  if (isPending) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (error) return <div>An error has occurred: {error.message}</div>;

  if (!isSuccess || !questions.data || !Array.isArray(questions.data)) {
    return <div>No questions found</div>;
  }

  const numberOfQuestions = questions.data.length;
  console.log(questions, numberOfQuestions, idInt);

  const question = questions.data
    .map(transformQuestion)
    .find((question: BaseQuestion) => question.index - 10 === idInt);

  // console.log(question.index - 10 === idInt)

  if (!question) {
    return (
      <div>
        <p className="mb-4">
          Something went wrong with this question! Kindly proceed
        </p>
        <Navigation idInt={idInt} numberOfQuestions={numberOfQuestions} />
      </div>
    );
  }

  question.index = idInt;

  const questionObject: BaseQuestion & {
    selected: string;
    setSelected: (value: string) => void;
  } = {
    ...question,
    selected: answers[question.index] ?? "",
    setSelected: (value: string) =>
      handleSelect(question.index, value, setAnswers),
  };

  return (
    <div className="flex flex-col gap-6">
      <HeaderText title="Questionnaire" />
      <TestInstruction numberOfQuestions={numberOfQuestions}>
        From the multiple choice questions, you are to choose answer between
        option A - E
      </TestInstruction>

      <Question questionObject={questionObject} />

      <Navigation idInt={idInt} numberOfQuestions={numberOfQuestions} />
    </div>
  );
};

export default QuestionnaireTest;

const Navigation: React.FC<{ idInt: number; numberOfQuestions: number }> = ({
  idInt,
  numberOfQuestions,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 flex-col md:flex-row mlg:flex-col lgd:flex-row justify-between">
      {idInt > 1 && (
        <div className="md:mr-auto mlg:mr-0 lgd:mr-auto">
          <MainButton
            white
            onClick={() => navigate(`../questionnairetest/${idInt - 1}`)}
          >
            Previous Question
          </MainButton>
        </div>
      )}
      {idInt < numberOfQuestions && (
        <div className="md:ml-auto mlg:ml-0 lgd:ml-auto">
          <MainButton
            onClick={() => navigate(`../questionnairetest/${idInt + 1}`)}
          >
            Next Question
          </MainButton>
        </div>
      )}
      {idInt === numberOfQuestions && (
        <div className="md:ml-auto mlg:ml-0 lgd:ml-auto">
          <MainButton
            onClick={() => {
              toast.warning("You cannot edit your answers after this step");
              // submit answers
              setTimeout(() => {
                navigate(`../../../dashboard`);
              }, 2000);
            }}
          >
            Submit Answers And Proceed
          </MainButton>
        </div>
      )}
    </div>
  );
};
