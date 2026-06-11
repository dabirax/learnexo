import React from "react";
import Aside from "../pages/onboarding/components/Aside";
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const OnboardingLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col mlg:flex-row w-full min-h-screen bg-white relative">
      <Aside />

      <main className="flex-1 flex flex-col relative bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:40px_40px] opacity-30 pointer-events-none" />

        <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-white/80 to-white pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="h-16 px-8 mlg:px-12 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 mlg:p-12">
            <div className="w-full max-w-[540px] animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
