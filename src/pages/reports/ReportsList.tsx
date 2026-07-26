import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAssessmentHistory } from "@/utils/queries/reports";
import { FileText, Eye, Calendar, BookOpen, BarChart3 } from "lucide-react";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";

const ReportsLoading = () => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-6">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
      <FileText size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-600" />
    </div>
    <div className="text-center">
      <p className="text-slate-900 font-semibold text-lg">Loading Reports...</p>
      <p className="text-slate-500 text-sm mt-1">Fetching your assessment history</p>
    </div>
  </div>
);

const ReportsList = () => {
  useDocumentTitle("Reports");
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["assessmentHistory"],
    queryFn: getAssessmentHistory,
  });

  if (isLoading) return <ReportsLoading />;

  const history = data?.history || [];

  if (!history.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
        <FileText size={48} className="text-slate-300" />
        <p className="text-slate-500 text-lg">No assessment reports yet.</p>
        <p className="text-slate-400 text-sm">Take an assessment to generate your first report.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assessment Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">View detailed insights and corrections for all your assessments.</p>
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <div
            key={item.assessmentId}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <BookOpen size={22} className="text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white capitalize">
                    {item.title || `${item.subject} — ${item.type}`}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1 capitalize">
                      <Calendar size={14} />
                      {item.class.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 size={14} />
                      Score: {item.score}%
                    </span>
                    <span>
                      {new Date(item.completedAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/dashboard/reports/${item.assessmentId}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-violet-600 active:bg-violet-700 active:scale-95 transition-all"
                >
                  <Eye size={16} />
                  View Insight
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsList;
