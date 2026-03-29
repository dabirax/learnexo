// import { useEffect } from "react";
import successimg from "../../../../assets/images/success.png";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

const ResetPasswordSuccess = () => {

  return (
    <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-700 space-y-8">
      <div className="relative group">
        <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full scale-150 animate-pulse" />

        <div className="relative z-10 transform transition-transform duration-500 hover:scale-110">
          <img
            src={successimg}
            alt="Success"
            className="w-30 h-30 mlg:w-42 mlg:h-42 object-contain drop-shadow-2xl"
          />
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-4 border-emerald-50">
            <CheckCircle2 className="text-emerald-500" size={40} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl mlg:text-4xl font-extrabold text-slate-900 tracking-tight">
          All set!
        </h1>
        <p className="text-slate-500 font-medium max-w-xs mx-auto text-lg">
          Your password has been reset successfully.
        </p>
      </div>

      <div className="w-full max-w-sm space-y-6 pt-4">
        <Link
          to="/onboarding/auth/login"
          className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 group"
        >
          Proceed to Login
          <ArrowRight
            className="group-hover:translate-x-1 transition-transform"
            size={20}
          />
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;
