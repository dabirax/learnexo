import HeaderText from "../../components/HeaderText";
import { useLocation, useNavigate } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { confirmSignUpOTPRequest } from "@/utils/queries/auth";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";
import { ArrowRight, RefreshCw } from "lucide-react";

const ConfirmOTP = () => {
  const location = useLocation();
  const email = location.state?.email || "your email";
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState<string>("");

  const {
    mutate: confirmOTPMutation,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: confirmSignUpOTPRequest,
    mutationKey: ["confirmSignupOTPRequest"],
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account verified successfully!");
      setTimeout(() => {
        navigate("../../test/personalandcontactinfo");
      }, 2000);
    }
  }, [isSuccess, navigate]);


  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-8">
      <div className="space-y-2">
        <HeaderText
          title="Verify your account"
          description={`We've sent a 6-digit verification code to your email. Please enter it below to complete your registration.`}
        />
      </div>

      <div className="flex flex-col gap-10 items-center mlg:items-start">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otpValue}
          onChange={(value) => setOtpValue(value)}
          className="group"
        >
          <InputOTPGroup className="gap-3 mlg:gap-4">
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="w-12 h-14 mlg:w-16 mlg:h-20 text-2xl font-bold rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <div className="w-full space-y-4">
          <button
            onClick={() => confirmOTPMutation({ otp: otpValue, email })}
            disabled={isPending || otpValue.length < 6}
            className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isPending ? <Spinner /> : "Verify & Continue"}
            {!isPending && (
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={20}
              />
            )}
          </button>

          <button className="flex items-center justify-center gap-2 text-violet-600 font-bold text-sm hover:text-violet-700 transition-colors bg-violet-50 py-3 px-6 rounded-xl mx-auto">
            <RefreshCw size={16} />
            Resend Email
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <p className="text-xs text-center mlg:text-left text-slate-400 leading-relaxed">
          By verifying your account, you agree to our automated learning
          analysis. Make sure you have 10–15 minutes ready for your initial
          aptitude assessment.
        </p>
      </div>
    </div>
  );
};

export default ConfirmOTP;
