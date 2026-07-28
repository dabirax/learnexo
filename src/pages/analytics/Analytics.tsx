import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { getAnalytics, getBktTraces } from "@/utils/queries/analytics";
import { BarChart3, TrendingUp, GitCompare, BookOpen, Radar as RadarIcon, Activity } from "lucide-react";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";

const TRACE_COLORS = ["#7c3aed", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#14b8a6", "#f97316"];

const AnalyticsLoading = () => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-6">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
      <BarChart3 size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-600" />
    </div>
    <div className="text-center">
      <p className="text-slate-900 font-semibold text-lg">Loading Analytics...</p>
      <p className="text-slate-500 text-sm mt-1"> crunching your learning data</p>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
    <BookOpen size={48} className="text-slate-300" />
    <p className="text-slate-500 dark:text-slate-400 text-lg">No analytics data available yet.</p>
    <p className="text-slate-400 dark:text-slate-500 text-sm">Complete some assessments to see your progress.</p>
  </div>
);

const Analytics = () => {
  useDocumentTitle("Analytics");
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });

  const { data: tracesData } = useQuery({
    queryKey: ["bktTraces"],
    queryFn: getBktTraces,
  });

  if (isLoading) return <AnalyticsLoading />;
  if (!data) return <EmptyState />;

  const classMasteryData = Object.entries(data.classMastery).map(([subject, mastery]) => ({
    subject,
    mastery,
  }));

  const subjectNames = Object.keys(data.subjectProgress);

  const topicComparisonSubjects = Object.keys(data.topicComparison).filter(
    (subject) => data.topicComparison[subject]?.length > 0
  );

  const categoryMasterySubjects = Object.keys(data.categoryMastery ?? {}).filter(
    (subject) => data.categoryMastery[subject]?.length > 0
  );

  const traceSubjects = Object.keys(tracesData?.traces ?? {}).filter(
    (subject) => tracesData!.traces[subject]?.length > 0
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your learning progress and mastery across subjects.</p>
      </div>

      {/* Class Mastery */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={20} className="text-violet-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Class Mastery</h2>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classMasteryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} label={{ value: "%", angle: -90, position: "insideLeft" }} />
              <Tooltip
                formatter={(value) => [`${value}%`, "Mastery"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="mastery" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Mastery Profile — one radar per subject */}
      {categoryMasterySubjects.map((subjectName) => {
        const radarData = data.categoryMastery[subjectName].map((item) => ({
          category: item.category.replace(/_/g, " "),
          mastery: item.mastery,
        }));

        return (
          <div key={`radar-${subjectName}`} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <RadarIcon size={20} className="text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                {subjectName} Mastery Profile
              </h2>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} className="capitalize" />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} angle={90} />
                  <Radar
                    name="Mastery"
                    dataKey="mastery"
                    stroke="#7c3aed"
                    fill="#7c3aed"
                    fillOpacity={0.35}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Mastery"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}

      {/* Subject Progress Over Time */}
      {subjectNames.map((subjectName) => {
        const progressData = data.subjectProgress[subjectName]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((item) => ({
            date: new Date(item.date).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
            }),
            fullDate: item.date,
            score: item.score,
          }));

        return (
          <div key={subjectName} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900 capitalize">
                {subjectName} Progress Over Time
              </h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} label={{ value: "%", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Score"]}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullDate || label;
                    }}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ fill: "#7c3aed", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}

      {/* Topic Mastery Comparison — one chart per subject */}
      {topicComparisonSubjects.map((subjectName) => {
        const topicData = data.topicComparison[subjectName].map((item) => ({
          topic: item.topic.replace(/_/g, " "),
          current: item.currentMastery,
          mastery: Math.round(item.bktProbability * 100),
        }));

        return (
          <div key={`topic-${subjectName}`} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <GitCompare size={20} className="text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900 capitalize">
                {subjectName} Topic Mastery Comparison
              </h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="topic" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} label={{ value: "%", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value, name) => {
                      const labels: Record<string, string> = {
                        current: "Last Assessment",
                        mastery: "Mastery",
                      };
                      return [`${value}%`, labels[name as string] ?? (name as string)];
                    }}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  />
                  <Legend />
                  <Bar dataKey="current" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Last Assessment" />
                  <Bar dataKey="mastery" fill="#10b981" radius={[4, 4, 0, 0]} name="Mastery" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}

      {/* Mastery Growth — per-topic mastery curve over time */}
      {traceSubjects.map((subjectName) => {
        const topicTraces = tracesData!.traces[subjectName].map((t) => ({
          ...t,
          topic: t.topic.replace(/_/g, " "),
        }));

        const allDates = [
          ...new Set(topicTraces.flatMap((t) => t.history.map((h) => h.date))),
        ].sort();

        const chartData = allDates.map((date) => {
          const row: Record<string, string | number> = {
            date: new Date(date).toLocaleDateString("en-NG", {
              day: "numeric",
              month: "short",
            }),
            fullDate: date,
          };
          topicTraces.forEach((t) => {
            const point = t.history.find((h) => h.date === date);
            if (point) row[t.topic] = point.mastery;
          });
          return row;
        });

        return (
          <div key={`trace-${subjectName}`} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={20} className="text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                {subjectName} Mastery Growth
              </h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} label={{ value: "%", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, name]}
                    labelFormatter={(label, payload) => {
                      const item = payload?.[0]?.payload;
                      return item?.fullDate || label;
                    }}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  />
                  <Legend />
                  {topicTraces.map((t, i) => (
                    <Line
                      key={t.topic}
                      type="monotone"
                      dataKey={t.topic}
                      stroke={TRACE_COLORS[i % TRACE_COLORS.length]}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Analytics;
