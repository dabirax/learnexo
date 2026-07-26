import { Link } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

const AssessmentBreadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <h1 className="text-xl md:text-2xl font-semibold flex items-center gap-2 flex-wrap dark:text-white">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          {item.to ? (
            <Link
              to={item.to}
              className="text-gray-6 dark:text-slate-400 hover:text-blue-3 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-blue-3">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="text-gray-4 dark:text-slate-600">{">"}</span>}
        </span>
      ))}
    </h1>
  );
};

export default AssessmentBreadcrumb;
