import Logo from "../../../components/ui/Logo.tsx";
// import illustration from "../../../../src/assets/images/illustration.png"
import { Sparkles } from "lucide-react";

const Aside = () => {
  return (
    <div className="mlg:w-[47.6vw] mlg:h-screen mlg:min-h-[600px] bg-slate-950 p-12 lg:p-20 flex flex-col justify-between mlg:sticky top-0 left-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
        <Logo />
      </div>

      {/* <div>
        <img src={illustration} alt="max-h-[40vh]" />
      </div> */}

      <div className="hidden mlg:flex flex-col relative z-10 gap-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 w-fit">
          <Sparkles className="text-violet-400" size={16} />
          <span className="text-xs font-bold uppercase tracking-wider text-violet-300">AI-Powered Learning</span>
        </div>
        
        <h2 className="text-white font-bold text-4xl lg:text-5xl leading-tight tracking-tight">
          Master your subjects <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">
            with precision.
          </span>
        </h2>
        
        <p className="text-slate-400 text-lg leading-relaxed max-w-md">
          We use advanced AI to identify your knowledge gaps and build a personalized path just for you.
        </p>

        <div className="mt-8 flex gap-4">
          <div className="h-1 w-12 rounded-full bg-violet-500" />
          <div className="h-1 w-12 rounded-full bg-slate-800" />
          <div className="h-1 w-12 rounded-full bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export default Aside;