import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAssessmentHistory, getAssessmentReport } from "@/utils/queries/reports";
import { FileText, Eye, Calendar, BookOpen, BarChart3, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["assessmentHistory"],
    queryFn: getAssessmentHistory,
  });

  const handleDownloadPDF = async (assessmentId: string) => {
    const toastId = toast.loading("Generating PDF...");
    try {
      const report = await getAssessmentReport(assessmentId);
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "0";
      tempDiv.style.width = "800px";
      tempDiv.innerHTML = `
        <div style="padding:40px; font-family:system-ui,sans-serif; color:#1e293b; background:#fff;">
          <h1 style="font-size:28px; font-weight:bold; margin-bottom:8px;">${report.subject} Assessment Report</h1>
          <p style="color:#64748b; margin-bottom:24px;">Score: ${report.score}% | Class: ${report.class.toUpperCase()}</p>
          <h2 style="font-size:18px; font-weight:600; margin-bottom:12px;">Corrections</h2>
          ${report.corrections.map((c, i) => `
            <div style="margin-bottom:16px; padding:12px; border-radius:8px; background:${c.isCorrect ? '#f0fdf4' : '#fef2f2'}; border:1px solid ${c.isCorrect ? '#bbf7d0' : '#fecaca'};">
              <p style="font-weight:600; margin-bottom:4px;">Q${i + 1}. ${c.question}</p>
              <p>Your answer: ${c.userAnswer?.toUpperCase() || "-"} | Correct: ${c.correctAnswer?.toUpperCase() || "-"}</p>
              ${!c.isCorrect ? `<p style="color:#64748b; font-size:12px; margin-top:4px;">${c.explanation}</p>` : ""}
            </div>
          `).join("")}
        </div>
      `;
      document.body.appendChild(tempDiv);
      const canvas = await html2canvas(tempDiv, { scale: 2, backgroundColor: "#ffffff" });
      document.body.removeChild(tempDiv);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`report-${assessmentId}.pdf`);
      toast.success("PDF downloaded successfully", { id: toastId });
    } catch {
      toast.error("Failed to download PDF. Please try again.", { id: toastId });
    }
  };

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
        <h1 className="text-2xl font-bold text-slate-900">Assessment Reports</h1>
        <p className="text-slate-500 mt-1">View detailed insights and corrections for all your assessments.</p>
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <div
            key={item.assessmentId}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <BookOpen size={22} className="text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 capitalize">
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
                  onClick={() => handleDownloadPDF(item.assessmentId)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 active:bg-slate-100 active:scale-95 transition-all"
                >
                  <Download size={16} />
                  Download
                </button>
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
