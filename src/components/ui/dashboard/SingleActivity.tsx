import { BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { SingleActivityType } from "../../../utils/types/dashboard";

const SingleActivity: React.FC<SingleActivityType> = ({ title, topic, to }) => {
  return (
    <Link
      to={to}
      className="flex gap-3 items-center w-full group hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-t-slate-100 dark:border-t-slate-700 px-3 py-3 transition-colors"
    >
      <BadgeCheck className="text-violet-600 shrink-0" size={18} />
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="font-medium text-sm leading-5 capitalize text-slate-900 dark:text-white truncate">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-4 capitalize truncate">{topic}</p>
      </div>
    </Link>
  );
};

export default SingleActivity;
