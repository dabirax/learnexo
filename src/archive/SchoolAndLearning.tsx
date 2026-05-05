import { useLocation, useNavigate } from "react-router-dom";
import FormRow from "../components/ui/form/FormRow";
import PageProgress from "../components/ui/form/PageProgress";
import MainButton from "../components/ui/MainButton";
import HeaderText from "../pages/onboarding/components/HeaderText";
import { removeAndReturn } from "@/utils/funcs";
import {
  classOptions,
  gradeOptions,
  learningStyleOptions,
} from "../pages/onboarding/service";
import { useAppForm } from "@/services/form";
import { useMutation } from "@tanstack/react-query";
import { onboardingRequest } from "@/utils/queries/auth";
import { useEffect } from "react";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";

const SchoolAndLearning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { prevValue } = location.state;
  console.log(prevValue);

  const {
    mutate: onboardingMutation,
    data: response,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: onboardingRequest,
    mutationKey: ["onboardingRequest"],
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  const onboardingForm = useAppForm({
    defaultValues: {
      schoolName: "",
      class: "",
      learningStyle: "",
      schoolAddress: "",
      firstTerm: "",
      secondTerm: "",
      thirdTerm: "",
    },
    onSubmit: ({ value }) => {
      const pastExam = {
        firstTerm: removeAndReturn(value, "firstTerm"),
        secondTerm: removeAndReturn(value, "secondTerm"),
        thirdTerm: removeAndReturn(value, "thirdTerm"),
      };
      const newValue = { ...value, pastExam, ...prevValue };
      console.log(newValue);
      onboardingMutation(newValue);
    },
  });

  if (isSuccess) {
    toast.success(response.message);
    setTimeout(() => {
      navigate("../choosesubject");
    }, 2000);
  }

  return (
    <div className="flex flex-col gap-10">
      <PageProgress totalSteps={2} step={2} />
      <HeaderText
        title="School & Learning Background"
        description="Share your academic details to help us build your perfect learning path."
      />

      <form
        className="flex flex-col gap-10"
        onSubmit={(e) => {
          e.preventDefault();
          onboardingForm.handleSubmit();
        }}
      >
        <FormRow>
          <onboardingForm.AppField
            name="schoolName"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "School name is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Input
                placeholder="School name"
                name="school"
                type="text"
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
          <onboardingForm.AppField
            name="class"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Class is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Select
                placeholder="Class"
                name="class"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                options={classOptions}
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

        <onboardingForm.AppField
          name="learningStyle"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return "Preferred learning style is required";
              return undefined;
            },
          }}
          children={(field) => (
            <field.Select
              placeholder="Preferred learning style"
              name="learningStyle"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              options={learningStyleOptions}
              error={
                !field.state.meta.isValid
                  ? field.state.meta.errors[0]
                  : undefined
              }
            />
          )}
        />

        <FormRow>
          <onboardingForm.AppField
            name="schoolAddress"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "School address is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Input
                placeholder="School address"
                name="schoolAddress"
                type="text"
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

        <p className="font-medium text-[22px] text-blue-5">
          Past Examination Grade
        </p>

        <FormRow>
          <onboardingForm.AppField
            name="firstTerm"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "First term grade is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Select
                placeholder="first term grade"
                name="firstTerm"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                options={gradeOptions}
                error={
                  !field.state.meta.isValid
                    ? field.state.meta.errors[0]
                    : undefined
                }
                half
              />
            )}
          />
          <onboardingForm.AppField
            name="secondTerm"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Second term grade is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Select
                placeholder="second term grade"
                name="secondTerm"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                options={gradeOptions}
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

        <onboardingForm.AppField
          name="thirdTerm"
          validators={{
            onBlur: ({ value }) => {
              if (!value) return "Third term grade is required";
              return undefined;
            },
          }}
          children={(field) => (
            <field.Select
              placeholder="third term grade"
              name="thirdTerm"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              options={gradeOptions}
              error={
                !field.state.meta.isValid
                  ? field.state.meta.errors[0]
                  : undefined
              }
              half
            />
          )}
        />

        <onboardingForm.AppForm>
          <MainButton submit>
            {isPending ? <Spinner /> : "Proceed to take Test"}
          </MainButton>
        </onboardingForm.AppForm>
      </form>
    </div>
  );
};

export default SchoolAndLearning;
