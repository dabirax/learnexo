import { Link } from "react-router-dom";
import { PlayCircle, Lightbulb } from "lucide-react";

type ActionCardsProps = {
  takeAssessmentTo: string;
  insightOpen: boolean;
  onToggleInsight: () => void;
};

const cardClass =
  "rounded-3xl border border-gray-3 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 flex items-center gap-4 text-left hover:scale-[1.02] hover:shadow-lg active:scale-95 transition-transform duration-300";

const ActionCards: React.FC<ActionCardsProps> = ({
  takeAssessmentTo,
  insightOpen,
  onToggleInsight,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link to={takeAssessmentTo} className={cardClass}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-3/10 shrink-0">
          <PlayCircle className="text-blue-3" size={20} />
        </div>
        <div>
          <p className="font-semibold dark:text-white">Take Assessment</p>
          <p className="text-xs text-gray-6 dark:text-slate-400">Start a new assessment</p>
        </div>
      </Link>

      <button type="button" onClick={onToggleInsight} className={cardClass}>
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-3/10 shrink-0">
          <Lightbulb className="text-blue-3" size={20} />
        </div>
        <div>
          <p className="font-semibold dark:text-white">
            {insightOpen ? "Hide your last results" : "Review Previous Insight"}
          </p>
          <p className="text-xs text-gray-6 dark:text-slate-400">See how you performed last time</p>
        </div>
      </button>
    </div>
  );
};

export default ActionCards;
