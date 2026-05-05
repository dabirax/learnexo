import HeaderText from "../../components/HeaderText";
import { useLocation, useNavigate } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect } from "react";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";
import { ArrowRight, RefreshCw } from "lucide-react";
import {
  useConfirmOTPMutation,
  useSendOtpToEmailMutation,
} from "@/services/onboarding/queries";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  code: z.string().min(6, "Please enter the full 6-digit code."),
});

const ConfirmOTP = () => {
  const location = useLocation();
  const email: string =
    location.state?.email || "covenantcrackslord04@gmail.com";
  const navigate = useNavigate();

  const {
    mutate: confirmOTPMutation,
    isPending,
    isError,
    isSuccess,
    error,
  } = useConfirmOTPMutation();

  const {
    mutate: resendOTPMutation,
    isPending: isPendingResend,
    isError: isErrorResend,
    isSuccess: isSuccessResend,
    error: errorResend,
  } = useSendOtpToEmailMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    confirmOTPMutation({ email: email, otp: data.code });
  };

  useEffect(() => {
    // if (!email.trim()) {
    //   toast.error("Email not found");

    //   setTimeout(() => {
    //     navigate("/onboarding/auth/login");
    //   }, 2000);
    // }

    if (isError) {
      toast.error(error.message);
    }

    if (isErrorResend) {
      toast.error(errorResend.message);
    }

    if (isSuccessResend) {
      toast.success("OTP sent successfully!");
    }

    if (isSuccess) {
      toast.success("Account verified successfully!");

      setTimeout(() => {
        navigate("/onboarding/auth/login");
      }, 2000);
    }
  }, [isError, error, isSuccess, email]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-8">
      <div className="space-y-2">
        <HeaderText
          title="Verify your account"
          description={`We've sent a 6-digit verification code to your email. Please enter it below to complete your registration.`}
        />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col gap-10 items-center"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                  >
                    <InputOTPGroup className="gap-3 mlg:gap-4">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-12 h-14 mlg:w-16 mlg:h-20 text-2xl font-bold rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all outline-none"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full space-y-4">
            <button
              disabled={isPending}
              type="submit"
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

            <button
              className="flex items-center justify-center gap-2 text-violet-600 font-bold text-sm hover:text-violet-700 transition-colors bg-violet-50 py-3 px-6 rounded-xl mx-auto group min-w-48"
              type="button"
              onClick={() => resendOTPMutation({ email: email })}
            >
              {isPendingResend ? (
                <Spinner dark/>
              ) : (
                <div className="flex items-center gap-4 group">
                  <RefreshCw
                    size={16}
                    className="group-hover:rotate-180 transition-transform duration-600 ease-in-out"
                  />
                  Resend OTP
                </div>
              )}
            </button>
          </div>
        </form>
      </Form>

      {/* </div> */}

      <div className="pt-6 border-t border-slate-100">
        <p className="text-xs text-center mlg:text-left text-slate-400 leading-relaxed">
          By verifying your account, you agree to our automated learning
          analysis. Make sure you have 10-15 minutes ready for your initial
          aptitude assessment.
        </p>
      </div>
    </div>
  );
};

export default ConfirmOTP;
