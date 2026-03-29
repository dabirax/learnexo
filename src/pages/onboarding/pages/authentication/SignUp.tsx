import HeaderText from "../../components/HeaderText";
import Check from "@/components/ui/form/Check";
import BlueTextLink from "@/components/ui/BluetextLink";
import { roleOptions } from "../../service";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signupUserRequest } from "@/utils/queries/auth";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Selector } from "@/components/ui/form/Selector";
import Spinner from "../../../../components/ui/Spinner";
import { setLocalStorage } from "@/utils/hooks/getSessionStorage";
import { ArrowRight } from "lucide-react";

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    role: z.string().min(1, "Role is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const [agreed, setAgreed] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    mutate: signupMutation,
    data: response,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: signupUserRequest,
    mutationKey: ["signupRequest"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  if (isSuccess) {
    toast.success(response.message);
    const userId = response.data.id;
    setLocalStorage("userId", userId);
    const email: string = form.getValues("email");
    setTimeout(() => {
      navigate("../confirmOTP", { state: { email } });
    }, 2000);
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!agreed) {
      toast.warning("Please agree to the Terms and Conditions");
      return;
    }
    signupMutation(data);
  };

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HeaderText title="Create account" description="Already have an account?">
        <BlueTextLink>
          <Link
            to="../login"
            className="font-bold text-violet-600 hover:text-violet-700 transition-colors"
          >
            Login
          </Link>
        </BlueTextLink>
      </HeaderText>

      <Form {...form}>
        <form
          className="w-full space-y-5 mt-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 lgd:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative group">
                      <Input type="text" placeholder="First Name" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500 ml-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative group">
                      <Input type="text" placeholder="Last Name" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500 ml-1" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative group">
                    <Input
                      type="email"
                      placeholder="Email Address"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-rose-500 ml-1" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 lgd:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        type="password"
                        placeholder="Password"
                        visibility
                        {...field}
                      />
                    </div>
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
                    <div className="relative group">
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        visibility
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500 ml-1" />
                </FormItem>
              )}
            />
          </div>

          <div className="relative group">
            <Selector name="role" title="Select role" options={roleOptions} />
          </div>

          <div className="flex items-start gap-3 py-2">
            <Check state={agreed} setState={setAgreed} />
            <p className="text-slate-500 text-sm leading-snug">
              I agree to LearNEXO{" "}
              <Link
                to="/terms"
                className="text-violet-600 font-semibold hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-violet-600 font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isPending ? <Spinner /> : "Create Account"}
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

export default SignUp;
