import { Link } from "react-router-dom";
import { Lightbulb } from "lucide-react";

type TopicTileProps = {
  title: string;
  progress: number;
  takeTestTo: string;
  onShowInsight: () => void;
};

const TopicTile: React.FC<TopicTileProps> = ({
  title,
  progress,
  takeTestTo,
  onShowInsight,
}) => {
  return (
    <div className="rounded-3xl border border-gray-3 bg-white p-5 flex flex-col justify-between gap-3 hover:scale-105 transition-transform duration-300">
      <p className="font-semibold text-sm md:text-base capitalize">
        {title.replace(/_/g, " ")}
      </p>

      <div className="flex flex-col gap-1">
        <div className="h-1.5 bg-gray-4 rounded-full">
          <div
            className={`h-full rounded-full ${progress < 50 ? "bg-red-700" : "bg-blue-3"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-6">{progress}%</p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={takeTestTo}
          className="bg-blue-3 text-white px-3 py-1.5 text-xs font-semibold rounded-md hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          Take Test
        </Link>
        <button
          type="button"
          onClick={onShowInsight}
          aria-label="Show insight"
          className="p-1.5 rounded-md border border-gray-3 text-blue-3 hover:bg-blue-3/10 transition-colors"
        >
          <Lightbulb size={14} />
        </button>
      </div>
    </div>
  );
};

export default TopicTile;
