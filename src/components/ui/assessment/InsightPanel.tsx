import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import type { InsightResponse } from "@/utils/queries/assessmentCatalog";

type InsightPanelProps = {
  isLoading: boolean;
  insight?: InsightResponse;
};

const InsightPanel: React.FC<InsightPanelProps> = ({ isLoading, insight }) => {
  return (
    <div className="rounded-3xl border border-gray-3 bg-white p-5 animate-in fade-in slide-in-from-bottom-4">
      {isLoading ? (
        <div className="py-6 flex justify-center">
          <Spinner dark />
        </div>
      ) : !insight?.hasInsight ? (
        <p className="text-sm text-gray-6 text-center py-4">
          No previous assessment yet. Take an assessment to see insights here.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-3">
              Last Score
            </h3>
            <p className="text-2xl font-semibold text-blue-3">{insight.score}%</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-green-1 mb-2">
                <CheckCircle2 size={15} />
                <h4 className="text-xs font-bold uppercase tracking-widest">
                  Strong Topics
                </h4>
              </div>
              {insight.strongTopics.length ? (
                <ul className="text-sm flex flex-col gap-1">
                  {insight.strongTopics.map((t) => (
                    <li
                      key={t.topicInstanceId}
                      className="capitalize flex justify-between gap-2"
                    >
                      <span>{t.name.replace(/_/g, " ")}</span>
                      <span className="text-gray-6">{t.accuracy}%</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-6">None yet</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <AlertTriangle size={15} />
                <h4 className="text-xs font-bold uppercase tracking-widest">
                  Weak Topics
                </h4>
              </div>
              {insight.weakTopics.length ? (
                <ul className="text-sm flex flex-col gap-1">
                  {insight.weakTopics.map((t) => (
                    <li
                      key={t.topicInstanceId}
                      className="capitalize flex justify-between gap-2"
                    >
                      <span>{t.name.replace(/_/g, " ")}</span>
                      <span className="text-gray-6">{t.accuracy}%</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-6">None yet</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2 bg-blue-3/5 rounded-2xl p-4">
            <Lightbulb className="text-blue-3 shrink-0" size={18} />
            <p className="text-sm text-blue-5">{insight.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightPanel;
