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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Selector } from "@/components/ui/form/Selector";
import MainButton from "@/components/ui/MainButton";
import Spinner from "@/components/ui/Spinner";
import { setLocalStorage } from "@/utils/hooks/getSessionStorage";

const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email(),
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
  // const [emailConfirmationOpen, setEmailConfirmationOpen] =
  // useState<boolean>(false);
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
    console.log(data);
    if (!agreed) {
      toast.warning("Agree to the LearNEXO tearms and conditions");
      return;
    }
    signupMutation(data);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* {emailConfirmationOpen && <EmailConfirmation />} */}

      <HeaderText title="create account" description="Already have an account?">
        <BlueTextLink>
          <Link to="../login">Login</Link>
        </BlueTextLink>
      </HeaderText>

      <Form {...form}>
        <form
          className="w-full space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel hidden>First name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="First Name"
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel hidden>Last name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Last Name"
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel hidden>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel hidden>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    visibility
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel hidden>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full"
                    {...field}
                    visibility
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Selector name="role" title="Select role" options={roleOptions} />

          <div className="text-blue-6 text-[14px] flex gap-2 items-center md:mb-6">
            <Check state={agreed} setState={setAgreed} />
            <p>
              I agree to LearNEXO <BlueTextLink>Terms of service</BlueTextLink>{" "}
              and <BlueTextLink>Privacy Policy</BlueTextLink>
            </p>
          </div>

          <MainButton submit>{isPending ? <Spinner /> : "Sign Up"}</MainButton>
        </form>
      </Form>

      {/* <Or />

      <AltOnboardingMethods /> */}
    </div>
  );
};

export default SignUp;
