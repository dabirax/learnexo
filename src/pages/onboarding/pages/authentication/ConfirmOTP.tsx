import HeaderText from "../../components/HeaderText";
import { useLocation, useNavigate } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  confirmSignUpOTPRequest,
  loginUserRequest,
  sendOTPToEmailRequest,
} from "@/services/onboarding/requests";
import { setSessionStorage } from "@/utils/session";
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
  const email: string = location.state?.email ?? "";
  const password: string = location.state?.password ?? "";
  const navigate = useNavigate();

  const { mutate: loginAfterVerify, isPending: isLoggingIn } = useMutation({
    mutationFn: loginUserRequest,
    onSuccess: (response) => {
      setSessionStorage("accessToken", response.data.accessToken);
      const userData = response.data.user as unknown as Record<string, unknown>;
      Object.entries(userData).forEach(([key, value]) => {
        setSessionStorage(
          `user${key.charAt(0).toUpperCase() + key.slice(1)}`,
          value,
        );
      });
      navigate("/onboarding/test/personalandcontactinfo");
    },
    onError: () => {
      toast.info("Account verified! Please log in to continue.");
      navigate("/onboarding/auth/login");
    },
  });

  const { mutate: confirmOTPMutation, isPending: isVerifying } = useMutation({
    mutationFn: confirmSignUpOTPRequest,
    onSuccess: () => {
      toast.success("Account verified! Setting up your profile...");
      loginAfterVerify({ email, password });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: resendOTPMutation, isPending: isPendingResend } = useMutation({
    mutationFn: sendOTPToEmailRequest,
    onSuccess: () => toast.success("OTP sent successfully!"),
    onError: (err: Error) => toast.error(err.message),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    confirmOTPMutation({ email, otp: data.code });
  };

  const isPending = isVerifying || isLoggingIn;

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
              {isPending ? (
                <Spinner />
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={20}
                  />
                </>
              )}
            </button>

            <button
              className="flex items-center justify-center gap-2 text-violet-600 font-bold text-sm hover:text-violet-700 transition-colors bg-violet-50 py-3 px-6 rounded-xl mx-auto group min-w-48"
              type="button"
              onClick={() => resendOTPMutation({ email })}
            >
              {isPendingResend ? (
                <Spinner dark />
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
