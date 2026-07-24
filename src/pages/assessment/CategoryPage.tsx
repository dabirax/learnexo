import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AssessmentBreadcrumb from "@/components/ui/assessment/Breadcrumb";
import TopicTile from "@/components/ui/assessment/TopicTile";
import ActionCards from "@/components/ui/assessment/ActionCards";
import InsightPanel from "@/components/ui/assessment/InsightPanel";
import Spinner from "@/components/ui/Spinner";
import {
  getTopicsWithProgress,
  getCategoryInsight,
  getCategoriesWithProgress,
} from "@/utils/queries/assessmentCatalog";
import { classLabel } from "@/utils/lib/assessmentCatalog";

const CategoryPage = () => {
  const { gradeClass = "", subject = "", category = "" } = useParams<{
    gradeClass: string;
    subject: string;
    category: string;
  }>();
  const [insightOpen, setInsightOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["assessmentTopics", gradeClass, subject, category],
    queryFn: () => getTopicsWithProgress(gradeClass, subject, category),
    enabled: !!gradeClass && !!subject && !!category,
  });

  const { data: subjectData } = useQuery({
    queryKey: ["assessmentCategories", gradeClass, subject],
    queryFn: () => getCategoriesWithProgress(gradeClass, subject),
    enabled: !!gradeClass && !!subject,
  });

  const { data: insight, isLoading: isInsightLoading } = useQuery({
    queryKey: ["assessmentCategoryInsight", gradeClass, subject, category],
    queryFn: () => getCategoryInsight(gradeClass, subject, category),
    enabled: insightOpen && !!gradeClass && !!subject && !!category,
  });

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Spinner dark />
      </div>
    );
  }

  if (!data) return null;

  const subjectId = subjectData?.subject.id ?? data.subject.id;
  const takeAssessmentTo = `/assessment/${subjectId}/${gradeClass}/1?category=${category}`;

  return (
    <div className="flex flex-col gap-6 p-6">
      <AssessmentBreadcrumb
        items={[
          { label: classLabel(gradeClass), to: "/assessment" },
          {
            label: subjectData?.subject.label ?? data.subject.name,
            to: `/assessment/${gradeClass}/${subject}`,
          },
          { label: data.label },
        ]}
      />

      <ActionCards
        takeAssessmentTo={takeAssessmentTo}
        insightOpen={insightOpen}
        onToggleInsight={() => setInsightOpen((prev) => !prev)}
      />

      {insightOpen && (
        <InsightPanel isLoading={isInsightLoading} insight={insight} />
      )}

      {data.topics.length === 0 ? (
        <p className="text-sm text-gray-6 text-center py-8">
          No topics available yet for this category.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {data.topics.map((topic) => (
            <TopicTile
              key={topic.id}
              title={topic.name}
              slug={topic.slug}
              progress={topic.progress}
              category={category}
              gradeClass={gradeClass}
              subjectId={subjectId}
              onShowInsight={() => setInsightOpen(true)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
