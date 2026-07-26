import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getAssessmentHistory,
  type AssessmentHistoryItem,
} from "@/utils/queries/reports";
import { getCourses } from "@/utils/queries/courses";
import { getAnalytics } from "@/utils/queries/analytics";
import { getSubjectsWithProgress } from "@/utils/queries/assessmentCatalog";
import { makeRequest } from "@/services/api";
import { getLocalStorage, getSessionStorage } from "@/utils/session";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Eye,
  FileText,
  Flame,
  GraduationCap,
  LayoutDashboard,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import Activities from "@/components/ui/dashboard/Activities";

/* ──────────── types ──────────── */
type ProfileData = {
  data?: {
    studentClass?: string;
    firstName?: string;
    lastName?: string;
    photo?: string | null;
  };
};

/* ──────────── welcome text with typing effect ──────────── */
const greetings = [
  { text: "Welcome back", lang: "English" },
  { text: "Kaabo", lang: "Yoruba" },
  { text: "Nnọọ", lang: "Igbo" },
  { text: "Sannu", lang: "Hausa" },
];

const WelcomeText = () => {
  const firstName: string = getSessionStorage("userFirstName") ?? "";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText =
      greetings[currentIndex].text + (firstName ? `, ${firstName}` : "");

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < fullText.length) {
            setDisplayText(fullText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % greetings.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, firstName]);

  return (
    <div className="flex flex-col gap-1">
      <p className="text-2xl font-bold text-slate-900 dark:text-white min-h-[1.2em]">
        {displayText}
        <span className="inline-block w-[2px] h-[0.9em] bg-slate-900 dark:bg-white ml-0.5 animate-pulse align-middle" />
      </p>
      <p className="text-slate-500 dark:text-slate-400 text-sm">
        Your personalized learning management system.
      </p>
    </div>
  );
};

/* ──────────── stat card ──────────── */
const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext?: string;
  color: string;
}) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</p>}
  </div>
);

/* ──────────── recent assessment row ──────────── */
const RecentAssessmentRow = ({
  item,
}: {
  item: AssessmentHistoryItem;
}) => {
  const navigate = useNavigate();
  const date = new Date(item.completedAt).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });

  const scoreColor =
    item.score >= 70
      ? "text-green-600 bg-green-50"
      : item.score >= 50
        ? "text-amber-600 bg-amber-50"
        : "text-red-600 bg-red-50";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
          <FileText size={18} className="text-violet-600" />
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-sm capitalize">
            {item.subject}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {item.class.toUpperCase()} · {date}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`text-sm font-bold px-3 py-1 rounded-full ${scoreColor}`}
        >
          {item.score}%
        </span>
        <button
          onClick={() => navigate(`/dashboard/reports/${item.assessmentId}`)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-violet-600 transition-colors"
          title="View Report"
        >
          <Eye size={16} />
        </button>
      </div>
    </div>
  );
};

/* ──────────── subject card ──────────── */
const SubjectCard = ({
  subject,
  progress,
  userClass,
}: {
  subject: string;
  progress: number;
  userClass: string;
}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/assessment/${subject}/${userClass}/1`)}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-violet-200 transition-all text-left group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
          <BookOpen size={18} />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Play
            size={14}
            className="text-violet-600 fill-violet-600"
          />
        </div>
      </div>
      <p className="font-bold text-slate-900 dark:text-white capitalize">{subject}</p>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-500">Progress</span>
          <span className="font-semibold text-slate-700">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </button>
  );
};

/* ──────────── recommended topic row ──────────── */
const RecommendedTopicRow = ({
  topic,
  index,
}: {
  topic: { recommended_topic: string; recommend_for: string; feedback: string };
  index: number;
}) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
    <div className="w-8 h-8 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center text-sm font-bold shrink-0">
      {index + 1}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-slate-900 text-sm">
        {topic.recommended_topic}
      </p>
      <p className="text-xs text-slate-500 mt-0.5">{topic.recommend_for}</p>
      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
        {topic.feedback}
      </p>
    </div>
  </div>
);

/* ──────────── main dashboard ──────────── */
const Dashboard = () => {
  useDocumentTitle("Dashboard");
  const navigate = useNavigate();

  const rawRecommendations = getLocalStorage("assessment_reccs");
  const recommendations = Array.isArray(rawRecommendations)
    ? rawRecommendations
    : [];

  /* queries */
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["assessmentHistory"],
    queryFn: getAssessmentHistory,
  });

  const { data: coursesData } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => makeRequest<ProfileData>("/auth/profile"),
    retry: false,
  });

  const userClass =
    profileData?.data?.studentClass?.toLowerCase() || "jss2";

  const { data: subjectsData } = useQuery({
    queryKey: ["subjectsWithProgress", userClass],
    queryFn: () => getSubjectsWithProgress(userClass),
    enabled: !!userClass,
  });

  /* derived values */
  const history = historyData?.history ?? [];
  const assessmentCount = history.length;
  const avgScore =
    assessmentCount > 0
      ? Math.round(
          history.reduce((sum, h) => sum + h.score, 0) / assessmentCount,
        )
      : 0;

  const coursesCount =
    (coursesData?.recent?.length ?? 0) +
    Object.values(coursesData?.bySubject ?? {}).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );

  const recentAssessments = history.slice(0, 5);

  const activityItems = recentAssessments.map((item) => ({
    title: `Completed ${item.subject} Assessment`,
    topic: `Score: ${item.score}%`,
    to: `/dashboard/reports/${item.assessmentId}`,
  }));

  const classMastery = analyticsData?.classMastery;
  const masteryChartData = classMastery
    ? Object.entries(classMastery).map(([subject, mastery]) => ({
        subject: subject.charAt(0).toUpperCase() + subject.slice(1),
        mastery: Number(mastery),
      }))
    : [];

  const bestSubject =
    masteryChartData.length > 0
      ? masteryChartData.reduce((best, curr) =>
          curr.mastery > best.mastery ? curr : best,
        )
      : null;

  const isLoading = historyLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
          <LayoutDashboard
            size={24}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-600"
          />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-semibold text-lg">
            Loading your dashboard...
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Fetching your learning data
          </p>
        </div>
      </div>
    );
  }

  const hasData = assessmentCount > 0 || coursesCount > 0;

  return (
    <div className="px-6 max-w-7xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <WelcomeText />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/assessment")}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-500 active:bg-violet-700 active:scale-95 transition-all shadow-lg shadow-violet-200"
          >
            <ClipboardCheck size={16} />
            Take Assessment
          </button>
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all"
          >
            <BookOpen size={16} />
            My Courses
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ClipboardCheck}
          label="Assessments Taken"
          value={String(assessmentCount)}
          subtext={
            assessmentCount > 0
              ? `${recentAssessments[0]?.subject} — ${recentAssessments[0]?.score}%`
              : "Start your first assessment"
          }
          color="bg-violet-50 text-violet-600"
        />
        <StatCard
          icon={Target}
          label="Average Score"
          value={avgScore > 0 ? `${avgScore}%` : "—"}
          subtext={
            bestSubject
              ? `Best: ${bestSubject.subject} (${bestSubject.mastery}%)`
              : "Complete assessments to see avg"
          }
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={BookOpen}
          label="Learning Materials"
          value={String(coursesCount)}
          subtext={
            coursesCount > 0 ? "AI-recommended content" : "No recommendations yet"
          }
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={Flame}
          label="Learning Streak"
          value={assessmentCount > 0 ? `${Math.min(assessmentCount, 30)} days` : "—"}
          subtext={
            assessmentCount > 0
              ? "Keep it up!"
              : "Take an assessment to start a streak"
          }
          color="bg-rose-50 text-rose-600"
        />
      </div>

      {/* ── Charts + Recent ── */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Class Mastery Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Subject Mastery
              </h2>
            </div>
            {bestSubject && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <Trophy size={12} />
                Best: {bestSubject.subject} {bestSubject.mastery}%
              </div>
            )}
          </div>

          {masteryChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={masteryChartData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="subject"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Mastery"]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="mastery" radius={[6, 6, 0, 0]}>
                    {masteryChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.mastery >= 70
                            ? "#10b981"
                            : entry.mastery >= 50
                              ? "#f59e0b"
                              : "#7c3aed"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <TrendingUp size={40} className="text-slate-200" />
              <p className="text-slate-400 dark:text-slate-500 text-sm">
                Complete assessments to see mastery breakdown
              </p>
            </div>
          )}
        </div>

        {/* Recent Assessments */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recent Assessments
              </h2>
            </div>
            {history.length > 5 && (
              <button
                onClick={() => navigate("/dashboard/reports")}
                className="text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
              >
                View all
              </button>
            )}
          </div>

          <div className="space-y-1">
            {recentAssessments.length > 0 ? (
              recentAssessments.map((item) => (
                <RecentAssessmentRow key={item.assessmentId} item={item} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <GraduationCap size={40} className="text-slate-200" />
                <p className="text-slate-400 dark:text-slate-500 text-sm text-center">
                  No assessments yet.
                  <br />
                  Take your first one to see results here!
                </p>
                <button
                  onClick={() => navigate("/assessment")}
                  className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Start Assessment →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Subject Recommendations ── */}
      <div>
        <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
          <Sparkles size={18} className="text-violet-600" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recommended Subjects
          </h2>
          <span className="text-xs text-slate-400 ml-2">
            Based on your class ({userClass.toUpperCase()})
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjectsData?.subjects?.length ? (
            subjectsData.subjects.slice(0, 8).map((s) => (
              <SubjectCard
                key={s.name}
                subject={s.name}
                progress={s.progress}
                userClass={userClass}
              />
            ))
          ) : (
            <>
              <SubjectCard subject="mathematics" progress={0} userClass={userClass} />
              <SubjectCard subject="english" progress={0} userClass={userClass} />
              <SubjectCard subject="physics" progress={0} userClass={userClass} />
              <SubjectCard subject="chemistry" progress={0} userClass={userClass} />
            </>
          )}
        </div>
      </div>

      {/* ── Recommended Topics ── */}
      {recommendations.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
            <Target size={18} className="text-violet-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Focus Topics
            </h2>
            <span className="text-xs text-slate-400 ml-2">
              Prioritized weak areas to improve
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {recommendations.slice(0, 5).map((topic, i) => (
              <RecommendedTopicRow key={i} topic={topic} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Activity Feed ── */}
      {activityItems.length > 0 && (
        <Activities title="Activity Feed" activities={activityItems} />
      )}

      {/* ── Empty State CTA ── */}
      {!hasData && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-violet-100 dark:border-slate-700 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
            <Sparkles size={28} className="text-violet-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Start Your Learning Journey
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Take an assessment to unlock personalized recommendations, track
            your progress, and see your mastery across subjects.
          </p>
          <button
            onClick={() => navigate("/assessment")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-500 active:bg-violet-700 active:scale-95 transition-all shadow-lg shadow-violet-200"
          >
            <ClipboardCheck size={18} />
            Take Your First Assessment
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
