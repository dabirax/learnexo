import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BentoBox from "./BentoBox";
import noData from "../../../assets/images/empty-table.png";
import type { Recommendation } from "@/utils/types/baseTypes";

// const englishTopics = [
//   {
//     sn: "001",
//     topic: "Comprehension - Main and Supporting Ideas",
//     score: "12%",
//     status: "Ongoing",
//   },
//   {
//     sn: "002",
//     topic: "Grammar - Parts of Speech",
//     score: "15%",
//     status: "Ongoing",
//   },
//   {
//     sn: "003",
//     topic: "Writing - Formal and Informal Letters",
//     score: "16%",
//     status: "Ongoing",
//   },
//   {
//     sn: "004",
//     topic: "Literature - Figures of Speech",
//     score: "20%",
//     status: "Ongoing",
//   },
// ];

const ActivitiesTable = ({
  recommendations,
}: {
  recommendations: Recommendation[] | null;
}) => {
  const hasRecommendations = recommendations && recommendations.length > 0;

  return (
    <div>
      <BentoBox>
        <h2 className="mb-4 font-semibold leading-5 z-20">
          Recommended topics
        </h2>

        {hasRecommendations ? (
          <Table className="table-fixed min-w-120">
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Focus</TableHead>
                <TableHead className="w-2/5">Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommendations.map((topic, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell className="truncate">
                    {topic.recommended_topic}
                  </TableCell>
                  <TableCell className="w-2/5 truncate">
                    {topic.recommend_for}
                  </TableCell>
                  <TableCell className="w-2/5 truncate">
                    {topic.feedback}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="w-full flex items-center flex-col gap-4 pb-8 pt-6">
            <p className="text-gray-6 text-sm font-medium leading-5">
              No recommendations yet
            </p>
            <img src={noData} alt="No Assessments" />
            <p className="text-gray-4 text-xs">
              Complete an assessment to get personalized recommendations.
            </p>
          </div>
        )}
      </BentoBox>
    </div>
  );
};

export default ActivitiesTable;
