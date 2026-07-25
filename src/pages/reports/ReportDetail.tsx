import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { getAssessmentReport } from "@/utils/queries/reports";
import { ArrowLeft, Download, CheckCircle2, XCircle, BrainCircuit, Sparkles, BookOpen, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

const ReportLoading = () => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-6">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
      <FileText size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-600" />
    </div>
    <div className="text-center">
      <p className="text-slate-900 font-semibold text-lg">Loading Report...</p>
      <p className="text-slate-500 text-sm mt-1">Fetching assessment details</p>
    </div>
  </div>
);

const ReportDetail = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["assessmentReport", assessmentId],
    queryFn: () => getAssessmentReport(assessmentId!),
    enabled: !!assessmentId,
  });

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const toastId = toast.loading("Generating PDF...");
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`assessment-report-${assessmentId}.pdf`);
      toast.success("PDF downloaded successfully", { id: toastId });
    } catch {
      toast.error("Failed to download PDF. Please try again.", { id: toastId });
    }
  };

  if (isLoading) return <ReportLoading />;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
        <FileText size={48} className="text-slate-300" />
        <p className="text-slate-500 text-lg">Report not found.</p>
        <button
          onClick={() => navigate("/dashboard/reports")}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-violet-600 transition-colors"
        >
          Back to Reports
        </button>
      </div>
    );
  }

  const correctCount = data.corrections.filter((c) => c.isCorrect).length;
  const wrongCount = data.corrections.length - correctCount;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/dashboard/reports")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Reports</span>
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 active:bg-violet-700 active:scale-95 transition-all"
        >
          <Download size={16} />
          Download PDF
        </button>
      </div>

      <div ref={reportRef} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-wider font-medium">
                Assessment Report
              </p>
              <h1 className="text-3xl font-bold mt-1 capitalize">
                {data.subject} — {data.class.toUpperCase()}
              </h1>
              <p className="text-slate-400 mt-2">
                {new Date(data.completedAt).toLocaleDateString("en-NG", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold">{data.score}%</p>
              <p className="text-slate-400 text-sm mt-1">Overall Score</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <CheckCircle2 size={18} />
                Correct
              </div>
              <p className="text-2xl font-bold text-green-800 mt-1">{correctCount}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-2 text-red-700 font-semibold">
                <XCircle size={18} />
                Wrong
              </div>
              <p className="text-2xl font-bold text-red-800 mt-1">{wrongCount}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 font-semibold">
                <BookOpen size={18} />
                Attempted
              </div>
              <p className="text-2xl font-bold text-blue-800 mt-1">{data.corrections.length}</p>
            </div>
          </div>

          {/* Topic Performance */}
          {(data.strongTopics.length > 0 || data.weakTopics.length > 0) && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BrainCircuit size={20} className="text-violet-600" />
                Topic Performance
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.strongTopics.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <h3 className="font-semibold text-green-800 mb-2">Strong Topics</h3>
                    <div className="space-y-2">
                      {data.strongTopics.map((topic) => (
                        <div key={topic.topicInstanceId} className="flex items-center justify-between">
                          <span className="text-green-700 text-sm capitalize">{topic.name.replace(/_/g, " ")}</span>
                          <span className="text-green-800 font-semibold text-sm">{topic.accuracy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.weakTopics.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <h3 className="font-semibold text-red-800 mb-2">Weak Topics</h3>
                    <div className="space-y-2">
                      {data.weakTopics.map((topic) => (
                        <div key={topic.topicInstanceId} className="flex items-center justify-between">
                          <span className="text-red-700 text-sm capitalize">{topic.name.replace(/_/g, " ")}</span>
                          <span className="text-red-800 font-semibold text-sm">{topic.accuracy}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Explanation */}
          {data.explanation && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-2">Insight</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{data.explanation}</p>
            </div>
          )}

          {/* Recommendations */}
          {data.recommendations && data.recommendations.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-amber-500" />
                Recommendations
              </h2>
              <div className="space-y-3">
                {data.recommendations.map((rec, i) => (
                  <div key={i} className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-amber-800 text-sm font-medium">{rec.recommended_topic}</p>
                    <p className="text-amber-700 text-sm mt-1">{rec.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Corrections */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Corrections</h2>
            <div className="space-y-4">
              {data.corrections.map((correction) => (
                <div
                  key={correction.questionNumber}
                  className={`rounded-xl p-4 border ${
                    correction.isCorrect
                      ? "bg-green-50 border-green-100"
                      : "bg-red-50 border-red-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {correction.isCorrect ? (
                        <CheckCircle2 size={18} className="text-green-600" />
                      ) : (
                        <XCircle size={18} className="text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">
                        Q{correction.questionNumber}. {correction.question}
                      </p>
                      <div className="mt-2 space-y-1">
                        {correction.options?.map((opt) => (
                          <div
                            key={opt.key}
                            className={`text-sm px-3 py-1.5 rounded-lg ${
                              opt.key === correction.correctAnswer
                                ? "bg-green-200 text-green-800 font-medium"
                                : opt.key === correction.userAnswer && !correction.isCorrect
                                  ? "bg-red-200 text-red-800"
                                  : "text-slate-600"
                            }`}
                          >
                            {opt.key.toUpperCase()}. {opt.text}
                          </div>
                        ))}
                      </div>
                      {!correction.isCorrect && (
                        <div className="mt-3 text-sm">
                          <p className="text-red-700">
                            Your answer: <span className="font-medium">{correction.userAnswer?.toUpperCase()}</span>
                          </p>
                          <p className="text-green-700 mt-1">
                            Correct answer: <span className="font-medium">{correction.correctAnswer?.toUpperCase()}</span>
                          </p>
                          {correction.explanation && (
                            <p className="text-slate-600 mt-2 text-xs">{correction.explanation}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
