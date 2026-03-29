import HeaderText from "../../components/HeaderText";
import BlueTextLink from "../../../../components/ui/BluetextLink";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUserRequest } from "../../../../utils/queries/auth";
import Spinner from "../../../../components/ui/Spinner";
import { toast } from "sonner";
import { setSessionStorage } from "@/utils/hooks/getSessionStorage";
import { useEffect } from "react";
import { ArrowRight} from "lucide-react";
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

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  const {
    mutate: loginMutation,
    data: response,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: loginUserRequest,
    mutationKey: ["loginRequest"],
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  if (isSuccess) {
    setSessionStorage("accessToken", response.data.accessToken);
    const userData = response.data.user;
    Object.entries(userData).forEach(([key, value]) => {
      setSessionStorage(
        `user${key.charAt(0).toUpperCase() + key.slice(1)}`,
        value,
      );
    });
    toast.success(response.message);
    navigate("../../../dashboard");
  }

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    loginMutation(data);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HeaderText title="Welcome back" description="Don't have an account?">
        <BlueTextLink>
          <Link
            to="../signup"
            className="font-bold text-violet-600 hover:text-violet-700 transition-colors"
          >
            Sign Up
          </Link>
        </BlueTextLink>
      </HeaderText>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        placeholder="Email address"
                        type="email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        placeholder="Password"
                        type="password"
                        visibility={true}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500 ml-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Link
              to="../forgotpassword"
              className="text-sm font-semibold text-slate-500 hover:text-violet-600 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group transform active:scale-[0.98] duration-200"
          >
            {isPending ? <Spinner /> : "Sign In"}
            {!isPending && (
              <ArrowRight
                className="group-hover:translate-x-2 transition-transform duration-250 ease-in-out"
                size={20}
              />
            )}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
