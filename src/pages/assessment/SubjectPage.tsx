import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AssessmentBreadcrumb from "@/components/ui/assessment/Breadcrumb";
import Tile from "@/components/ui/assessment/Tile";
import ActionCards from "@/components/ui/assessment/ActionCards";
import InsightPanel from "@/components/ui/assessment/InsightPanel";
import Spinner from "@/components/ui/Spinner";
import {
  getCategoriesWithProgress,
  getSubjectInsight,
} from "@/utils/queries/assessmentCatalog";
import { classLabel } from "@/utils/lib/assessmentCatalog";
import { getSubjectVisual } from "@/utils/lib/assessmentVisuals";

const SubjectPage = () => {
  const { gradeClass = "", subject = "" } = useParams<{
    gradeClass: string;
    subject: string;
  }>();
  const [insightOpen, setInsightOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["assessmentCategories", gradeClass, subject],
    queryFn: () => getCategoriesWithProgress(gradeClass, subject),
    enabled: !!gradeClass && !!subject,
  });

  const { data: insight, isLoading: isInsightLoading } = useQuery({
    queryKey: ["assessmentSubjectInsight", gradeClass, subject],
    queryFn: () => getSubjectInsight(gradeClass, subject),
    enabled: insightOpen && !!gradeClass && !!subject,
  });

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Spinner dark />
      </div>
    );
  }

  if (!data) return null;

  const visual = getSubjectVisual(data.subject.name);

  return (
    <div className="flex flex-col gap-6 p-6">
      <AssessmentBreadcrumb
        items={[
          { label: classLabel(gradeClass), to: "/assessment" },
          { label: data.subject.label },
        ]}
      />

      <ActionCards
        takeAssessmentTo={`/assessment/${data.subject.id}/${gradeClass}/1`}
        insightOpen={insightOpen}
        onToggleInsight={() => setInsightOpen((prev) => !prev)}
      />

      {insightOpen && (
        <InsightPanel isLoading={isInsightLoading} insight={insight} />
      )}

      {data.categories.length === 0 ? (
        <p className="text-sm text-gray-6 dark:text-slate-400 text-center py-8">
          No categories available yet for this subject.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.categories.map((category) => (
            <Tile
              key={category.category}
              to={`/assessment/${gradeClass}/${subject}/category/${category.category}`}
              title={category.label}
              progress={category.progress}
              icon={visual.icon}
              iconColor={visual.color}
              iconBg={visual.bg}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectPage;
