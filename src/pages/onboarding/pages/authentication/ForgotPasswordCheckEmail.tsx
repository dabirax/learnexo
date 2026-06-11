import HeaderText from "../../components/HeaderText";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";
import { ArrowRight, RefreshCw, ChevronLeft } from "lucide-react";
import { confirmOTPRequest } from "@/services/onboarding/requests";

const CheckEmail = () => {
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
    mutationFn: confirmOTPRequest,
    mutationKey: ["confirmForgotPasswordOTPRequest"],
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("OTP verified successfully");
      setTimeout(() => {
        navigate("../resetpassword", { state: { email } });
      }, 2000);
    }
  }, [isSuccess, navigate, email]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-8">
      <HeaderText
        title="Check your email"
        description={`We've sent a 6-digit verification code to your email. Please enter it below to reset your password.`}
      />

      <div className="flex flex-col gap-8 items-center mlg:items-start">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otpValue}
          onChange={(value) => setOtpValue(value)}
          className="group"
        >
          <InputOTPGroup className="gap-3">
            {[...Array(6)].map((_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <button
          disabled={isPending || otpValue.length < 6}
          onClick={() => confirmOTPMutation({ otp: otpValue, email })}
          className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isPending ? <Spinner /> : "Verify Code"}
          {!isPending && (
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform"
              size={20}
            />
          )}
        </button>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-100">
        <div className="text-center mlg:text-left">
          <p className="text-sm text-slate-500 mb-4 text-center">
            Didn't receive the email? Check your spam folder or try resending.
          </p>

          <div className="flex flex-col mlg:flex-row gap-4 justify-around">
            <button className="flex items-center justify-center gap-2 text-violet-600 font-bold text-sm hover:text-violet-700 transition-colors bg-violet-50 py-3 px-6 rounded-xl">
              <RefreshCw size={16} />
              Resend Email
            </button>

            <Link
              to="/onboarding/auth/login"
              className="flex items-center justify-center gap-2 text-slate-500 font-semibold hover:text-slate-900 transition-colors text-sm py-3 px-6"
            >
              <ChevronLeft size={18} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
