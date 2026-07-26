import { Loader2 } from "lucide-react";

const SuspenseFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={32} className="animate-spin text-violet-600" />
      <p className="text-sm text-slate-500 font-medium">Loading...</p>
    </div>
  </div>
);

export default SuspenseFallback;
