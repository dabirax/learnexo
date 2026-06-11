import HeaderText from "../pages/onboarding/components/HeaderText";
import Check from "@/components/ui/form/Check";
import BlueTextLink from "@/components/ui/BluetextLink";
import { roleOptions } from "../pages/onboarding/service";
import { Link, useNavigate } from "react-router-dom";
import FormRow from "@/components/ui/form/FormRow";
import { useAppForm } from "@/services/form";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signupUserRequest } from "@/utils/queries/auth";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";

const SignUp = () => {
  const [agreed, setAgreed] = useState<boolean>(false);
  // const [emailConfirmationOpen, setEmailConfirmationOpen] =
  // useState<boolean>(false);
  const navigate = useNavigate();

  const signUpForm = useAppForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    onSubmit: ({ value }) => {
      if (!agreed) {
        toast.warning("Agree to the LearNEXO tearms and conditions");
        return;
      }
      signupMutation(value);
    },
  });

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

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  if (isSuccess) {
    toast.success(response.message);
    const email: string = signUpForm.getFieldValue("email");
    setTimeout(() => {
      navigate("../confirmOTP", { state: { email } });
    }, 2000);
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* {emailConfirmationOpen && <EmailConfirmation />} */}

      <HeaderText title="create account" description="Already have an account?">
        <BlueTextLink>
          <Link to="../login">Login</Link>
        </BlueTextLink>
      </HeaderText>

      <form
        className="flex flex-col gap-4 md:gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          signUpForm.handleSubmit();
        }}
      >
        <FormRow>
          <signUpForm.AppField
            name="firstName"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "First name is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Input
                placeholder="First name"
                type="text"
                name="firstName"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  !field.state.meta.isValid
                    ? field.state.meta.errors[0]
                    : undefined
                }
                half
              />
            )}
          />

          <signUpForm.AppField
            name="lastName"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Last name is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Input
                placeholder="Last name"
                type="text"
                name="lastName"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                error={
                  !field.state.meta.isValid
                    ? field.state.meta.errors[0]
                    : undefined
                }
                half
              />
            )}
          />
        </FormRow>

        <signUpForm.AppField
          name="email"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return "Email is required";
              if (!value.includes("@")) return "Invalid email";
              return undefined;
            },
          }}
          children={(field) => (
            <field.Input
              placeholder="Email"
              type="email"
              name="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                !field.state.meta.isValid
                  ? field.state.meta.errors[0]
                  : undefined
              }
            />
          )}
        />

        <signUpForm.AppField
          name="password"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return "Password is required";
              if (value.length < 6)
                return "Password must be at least 6 characters";
              return undefined;
            },
          }}
          children={(field) => (
            <field.Input
              placeholder="Password"
              type="password"
              name="password"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                !field.state.meta.isValid
                  ? field.state.meta.errors[0]
                  : undefined
              }
              visibility
            />
          )}
        />

        <signUpForm.AppField
          name="confirmPassword"
          validators={{
            onChangeListenTo: ["password"],
            onChange: ({ value, fieldApi }) => {
              if (value !== fieldApi.form.getFieldValue("password")) {
                return "Passwords do not match";
              }
              return undefined;
            },
          }}
          children={(field) => (
            <field.Input
              placeholder="Confirm password"
              type="password"
              name="confirmPassword"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              error={
                !field.state.meta.isValid
                  ? field.state.meta.errors[0]
                  : undefined
              }
              visibility
            />
          )}
        />

        <signUpForm.AppField
          name="role"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return "Role is required";
              return undefined;
            },
          }}
          children={(field) => (
            <field.Select
              placeholder="Select role"
              name="role"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              options={roleOptions}
              error={
                !field.state.meta.isValid
                  ? field.state.meta.errors[0]
                  : undefined
              }
            />
          )}
        />

        <div className="text-blue-6 text-[14px] flex gap-2 items-center md:mb-6">
          <Check state={agreed} setState={setAgreed} />
          <p>
            I agree to LearNEXO <BlueTextLink>Terms of service</BlueTextLink>{" "}
            and <BlueTextLink>Privacy Policy</BlueTextLink>
          </p>
        </div>

        <signUpForm.AppForm>
          <signUpForm.MainButton submit>
            {isPending ? <Spinner /> : "Sign Up"}
          </signUpForm.MainButton>
        </signUpForm.AppForm>
      </form>

      {/* <Or />

      <AltOnboardingMethods /> */}
    </div>
  );
};

export default SignUp;
