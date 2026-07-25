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
} from "recharts";
import { getAnalytics } from "@/utils/queries/analytics";
import { BarChart3, TrendingUp, GitCompare, BookOpen } from "lucide-react";

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
    <p className="text-slate-500 text-lg">No analytics data available yet.</p>
    <p className="text-slate-400 text-sm">Complete some assessments to see your progress.</p>
  </div>
);

const Analytics = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Track your learning progress and mastery across subjects.</p>
      </div>

      {/* Class Mastery */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={20} className="text-violet-600" />
          <h2 className="text-lg font-bold text-slate-900">Class Mastery</h2>
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
          <div key={subjectName} className="bg-white rounded-2xl border border-slate-200 p-6">
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
          previous: item.previousMastery,
          current: item.currentMastery,
        }));

        return (
          <div key={`topic-${subjectName}`} className="bg-white rounded-2xl border border-slate-200 p-6">
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
                    formatter={(value, name) => [`${value}%`, name === "previous" ? "Previous Mastery" : "Last Assessment"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                  />
                  <Legend />
                  <Bar dataKey="previous" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Previous Mastery" />
                  <Bar dataKey="current" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Last Assessment" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Analytics;
