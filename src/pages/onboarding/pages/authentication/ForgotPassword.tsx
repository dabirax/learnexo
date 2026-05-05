import HeaderText from "../../components/HeaderText";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/ui/Spinner";
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
import { Input } from "@/components/ui/input";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { sendOTPToEmailRequest } from "@/services/onboarding/requests";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type SchemaType = z.infer<typeof schema>;

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    mutate: sendOTPMutation,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: sendOTPToEmailRequest,
    mutationKey: ["sendForgetPasswordOTP"],
  });

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("OTP sent successfully");
      const email = form.getValues("email");
      setTimeout(() => {
        navigate("checkemail", { state: { email } });
      }, 2000);
    }
  }, [isSuccess, navigate, form]);

  const onSubmit = (data: SchemaType) => {
    sendOTPMutation(data);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HeaderText
        title="Forgot password"
        description="Enter the email you used to create your account so we can send you instructions on how to reset your password."
      />

      <Form {...form}>
        <form
          className="flex flex-col gap-6 mt-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs text-rose-500 ml-1" />
              </FormItem>
            )}
          />

          <div className="space-y-4 mt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              {isPending ? <Spinner /> : "Send OTP"}
              {!isPending && (
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              )}
            </button>

            <Link
              to="/onboarding/auth/login"
              className="w-full py-4 flex items-center justify-center gap-2 text-slate-500 font-semibold hover:text-slate-900 transition-colors text-sm"
            >
              <ChevronLeft size={18} />
              Back to Login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPassword;
