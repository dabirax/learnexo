import HeaderText from "../../components/HeaderText";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordRequest } from "@/utils/queries/auth";
import { useEffect } from "react";
import { toast } from "sonner";
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

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SchemaType = z.infer<typeof schema>;

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  const {
    mutate: resetPasswordMutation,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: resetPasswordRequest,
    mutationKey: ["resetPasswordRequest"],
  });

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/resetpassword/success");
      }, 2000);
    }
  }, [isSuccess, navigate]);

  const onSubmit = (data: SchemaType) => {
    resetPasswordMutation({ password: data.password, email });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HeaderText
        title="Reset password"
        description="Choose a new password for your account. Make sure it's something you'll remember."
      />

      <Form {...form}>
        <form
          className="flex flex-col gap-6 mt-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="New Password"
                      type="password"
                      visibility
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500 ml-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Confirm New Password"
                      type="password"
                      visibility
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500 ml-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group transform active:scale-[0.98]"
            >
              {isPending ? <Spinner /> : "Reset Password"}
              {!isPending && (
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              )}
            </button>

            <Link
              to="/onboarding/auth/login"
              className="w-full py-2 flex items-center justify-center gap-2 text-slate-500 font-semibold hover:text-slate-900 transition-colors text-sm"
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

export default ResetPassword;
