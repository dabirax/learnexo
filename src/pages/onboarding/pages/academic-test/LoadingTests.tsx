import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, BrainCircuit, ShieldCheck, Zap } from "lucide-react";

const LoadingTests = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    "Analyzing your learning profile...",
    "Calibrating subject difficulty...",
    "Structuring personalized questions...",
    "Optimizing AI feedback engine...",
    "Finalizing your assessment path...",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 600);

    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2000);

    if (progress === 100) {
      setTimeout(() => {
        navigate("/onboarding/test/questionnairetest/1");
      }, 800);
    }

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, [progress, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-12 animate-in fade-in duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-violet-500/20 blur-[60px] rounded-full animate-pulse scale-150" />
        <div className="absolute inset-0 bg-emerald-400/10 blur-[40px] rounded-full animate-pulse delay-700 scale-110" />

        <div className="relative z-10 w-32 h-32 mlg:w-48 mlg:h-48 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-slate-100 group transition-transform hover:scale-105">
          <BrainCircuit
            size={64}
            className="text-violet-600 animate-bounce-slow"
          />

          <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-2 rounded-xl shadow-lg animate-bounce delay-150">
            <Zap size={20} />
          </div>
          <div className="absolute -bottom-2 -left-6 bg-slate-900 text-white p-2 rounded-xl shadow-lg animate-bounce delay-300">
            <Sparkles size={18} />
          </div>
        </div>
      </div>

      <div className="space-y-6 w-full max-w-sm">
        <div className="space-y-2">
          <h2 className="text-2xl mlg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Preparing your personalized assessment
          </h2>
          <p className="text-violet-600 font-bold text-sm uppercase tracking-[0.2em] animate-pulse">
            {statusMessages[statusIndex]}
          </p>
        </div>

        <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
          <span>AI Engine Active</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      <div className="pt-10 flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Secure Assessment
          </span>
        </div>
        <div className="h-4 w-[1px] bg-slate-300" />
        <div className="flex items-center gap-2">
          <BrainCircuit size={16} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            Adaptive Logic v3.1
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingTests;
