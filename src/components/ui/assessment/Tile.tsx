import { useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type Ripple = { id: number; x: number; y: number };

type TileProps = {
  to: string;
  title: string;
  progress: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
};

const Tile: React.FC<TileProps> = ({
  to,
  title,
  progress,
  icon: Icon,
  iconColor,
  iconBg,
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();

    setRipples((prev) => [
      ...prev,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className="relative overflow-hidden aspect-square rounded-3xl border border-gray-3 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between hover:scale-105 hover:shadow-lg active:scale-95 transition-transform duration-300"
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-blue-3/30 animate-tile-ripple pointer-events-none"
          style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20 }}
        />
      ))}

      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${iconBg}`}>
        <Icon className={iconColor} size={20} />
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-semibold text-sm md:text-base capitalize line-clamp-2 dark:text-white">
          {title}
        </p>
        <div className="h-1.5 bg-gray-4 dark:bg-slate-700 rounded-full">
          <div
            className={`h-full rounded-full ${progress < 50 ? "bg-red-700" : "bg-blue-3"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-6 dark:text-slate-400">{progress}%</p>
      </div>
    </Link>
  );
};

export default Tile;
