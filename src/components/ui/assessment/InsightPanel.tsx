import { CheckCircle2, AlertTriangle, Lightbulb, BookOpen, PlayCircle, ArrowRight } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import type { InsightResponse } from "@/utils/queries/assessmentCatalog";

type InsightPanelProps = {
  isLoading: boolean;
  insight?: InsightResponse;
};

const InsightPanel: React.FC<InsightPanelProps> = ({ isLoading, insight }) => {
  return (
    <div className="rounded-3xl border border-gray-3 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 animate-in fade-in slide-in-from-bottom-4">
      {isLoading ? (
        <div className="py-6 flex justify-center">
          <Spinner dark />
        </div>
      ) : !insight?.hasInsight ? (
        <p className="text-sm text-gray-6 dark:text-slate-400 text-center py-4">
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
                <h4 className="text-xs font-bold uppercase tracking-widest dark:text-white">
                  Strong Topics
                </h4>
              </div>
              {insight.strongTopics.length ? (
                <ul className="text-sm flex flex-col gap-1 dark:text-slate-300">
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
                <p className="text-sm text-gray-6 dark:text-slate-400">None yet</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <AlertTriangle size={15} />
                <h4 className="text-xs font-bold uppercase tracking-widest dark:text-white">
                  Weak Topics
                </h4>
              </div>
              {insight.weakTopics.length ? (
                <ul className="text-sm flex flex-col gap-1 dark:text-slate-300">
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
                <p className="text-sm text-gray-6 dark:text-slate-400">None yet</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2 bg-blue-3/5 rounded-2xl p-4">
            <Lightbulb className="text-blue-3 shrink-0" size={18} />
            <p className="text-sm text-blue-5 dark:text-blue-300">{insight.explanation}</p>
          </div>

          {insight.aiContent && insight.aiContent.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-blue-3 flex items-center gap-2">
                <BookOpen size={15} />
                Recommended Resources
              </h4>
              {insight.aiContent.slice(0, 3).map((item) => (
                <div
                  key={item.topic}
                  className="rounded-2xl border border-gray-3 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold capitalize text-slate-900 dark:text-white">
                      {item.topic.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-3/10 text-blue-3 font-bold uppercase">
                      Priority {item.priority}
                    </span>
                  </div>

                  {item.explanation?.summary && (
                    <p className="text-xs text-gray-6 dark:text-slate-400 leading-relaxed">
                      {item.explanation.summary}
                    </p>
                  )}

                  {item.resources?.videos && item.resources.videos.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-5 dark:text-slate-500">
                        Videos
                      </p>
                      <div className="flex flex-col gap-2">
                        {item.resources.videos.map((v, idx) => (
                          <a
                            key={idx}
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-3 hover:text-blue-4 transition-colors"
                          >
                            <PlayCircle size={14} />
                            <span className="truncate">{v.title}</span>
                            <ArrowRight size={12} className="ml-auto shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.resources?.materials && item.resources.materials.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-5 dark:text-slate-500">
                        Reading Materials
                      </p>
                      <div className="flex flex-col gap-2">
                        {item.resources.materials.map((m, idx) => (
                          <a
                            key={idx}
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-3 hover:text-blue-4 transition-colors"
                          >
                            <BookOpen size={14} />
                            <span className="truncate">{m.title}</span>
                            <ArrowRight size={12} className="ml-auto shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightPanel;
