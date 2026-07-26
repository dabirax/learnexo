import type { SingleActivityType } from "../../../utils/types/dashboard";
import SingleActivity from "./SingleActivity";

type ActivitiesProps = {
  title: string;
  activities: SingleActivityType[];
};

const Activities: React.FC<ActivitiesProps> = ({ title, activities }) => {
  if (activities.length === 0) return null;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="w-full p-4 border-b border-slate-100 dark:border-slate-700">
        <p className="text-lg leading-7 font-medium capitalize dark:text-white">{title}</p>
      </div>
      <div className="flex flex-col">
        {activities.map((activity, idx) => {
          const { title, topic, to } = activity;
          return <SingleActivity key={idx} title={title} topic={topic} to={to} />;
        })}
      </div>
    </div>
  );
};

export default Activities;
