import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "@/services/api";
import { getSessionStorage } from "@/utils/session";
import AssessmentBreadcrumb from "@/components/ui/assessment/Breadcrumb";
import Tile from "@/components/ui/assessment/Tile";
import Spinner from "@/components/ui/Spinner";
import { getSubjectsWithProgress } from "@/utils/queries/assessmentCatalog";
import { normalizeClass, classLabel } from "@/utils/lib/assessmentCatalog";
import { getSubjectVisual } from "@/utils/lib/assessmentVisuals";

type OnboardingData = {
  studentClass?: string;
};

const ClassPage = () => {
  const userId: string = getSessionStorage("userId") ?? "";

  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => makeRequest<{ data: OnboardingData }>("/auth/profile"),
    enabled: !!userId,
  });

  const klass = normalizeClass(profileData?.data?.studentClass ?? "");

  const { data, isLoading: isSubjectsLoading } = useQuery({
    queryKey: ["assessmentSubjects", klass],
    queryFn: () => getSubjectsWithProgress(klass),
    enabled: !!klass,
  });

  if (isProfileLoading || isSubjectsLoading) {
    return (
      <div className="p-6 flex justify-center">
        <Spinner dark />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <AssessmentBreadcrumb items={[{ label: classLabel(klass) }]} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data?.subjects.map((subject) => {
          const visual = getSubjectVisual(subject.name);
          return (
            <Tile
              key={subject.name}
              to={`/assessment/${klass}/${subject.name}`}
              title={subject.label}
              progress={subject.progress}
              icon={visual.icon}
              iconColor={visual.color}
              iconBg={visual.bg}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ClassPage;
