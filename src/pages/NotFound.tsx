import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Page Not Found");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-6">
          <SearchX size={36} className="text-violet-600" />
        </div>
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">404</h1>
        <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Page not found
        </p>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 active:scale-95 transition-all"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-500 active:bg-violet-700 active:scale-95 transition-all shadow-lg shadow-violet-200"
          >
            <Home size={16} />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
