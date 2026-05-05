import { useNavigate } from "react-router-dom";
import FormRow from "../components/ui/form/FormRow";
import PageProgress from "../components/ui/form/PageProgress";
import MainButton from "../components/ui/MainButton";
import HeaderText from "../pages/onboarding/components/HeaderText";
import ImagePlaceholder from "../pages/onboarding/components/ImagePlaceholder";
import { genderOptions, languageOptions } from "../pages/onboarding/service";
import { useAppForm } from "@/services/form";
import { mmddyyyyToISO } from "@/utils/funcs";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadImageRequest } from "@/utils/queries/auth";
import Spinner from "@/components/ui/Spinner";

const PersonalAndContactInfo = () => {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    mutate: uploadPhoto,
    data: response,
    isSuccess,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: uploadImageRequest,
    mutationKey: ["uploadImageRequest"],
  });

  const form = useAppForm({
    defaultValues: {
      dateOfBirth: "",
      gender: "",
      residentialAddress: "",
      town: "",
      state: "",
      stateOfOrigin: "",
      language: "",
      photo: "",
    },
    onSubmit: async ({ value }) => {
      value = { ...value, dateOfBirth: mmddyyyyToISO(value.dateOfBirth) };
      let prevValue = value;

      if (selectedImage) {
        uploadPhoto(selectedImage);

        if (isError) {
          toast.error(error.message);
          setTimeout(() => {
            navigate("../schoolandlearning", { state: { prevValue } });
          }, 2000);
        }

        if (isSuccess) {
          console.log(response);
          toast.success("Image uploaded");
          prevValue = { ...prevValue, photo: response.data.secure_url };
          navigate("../schoolandlearning", { state: { prevValue } });
          return;
        }
      }

      //   navigate("../schoolandlearning", { state: { prevValue } });
    },
  });

  return (
    <div className="flex flex-col gap-10">
      <PageProgress totalSteps={2} step={1} />
      <HeaderText
        title="Personal & Contact Information"
        description="Tell us about yourself so we can personalize your learning experience!"
      />
      <ImagePlaceholder setSelected={setSelectedImage} />

      <form
        className="flex flex-col gap-10"
        onSubmit={async (e) => {
          e.preventDefault();
          await form.handleSubmit();
        }}
      >
        <FormRow>
          <form.AppField
            name="dateOfBirth"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Date of birth is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Input
                placeholder="Date of birth"
                name="dateOfBirth"
                type="date"
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
          <form.AppField
            name="gender"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Gender is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Select
                placeholder="Gender"
                name="gender"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                options={genderOptions}
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

        <FormRow>
          <form.AppField
            name="residentialAddress"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Address is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Input
                placeholder="Residential address"
                name="residentialAddress"
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

          <form.AppField
            name="town"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Town is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Input
                placeholder="Town"
                name="town"
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

        <FormRow>
          <form.AppField
            name="state"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "State is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Input
                placeholder="State"
                name="state"
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
          <form.AppField
            name="stateOfOrigin"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "State of origin is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Input
                placeholder="State of origin"
                name="stateOfOrigin"
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

        <FormRow>
          <form.AppField
            name="language"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Language is required";
                return undefined;
              },
            }}
            children={(field) => (
              <field.Select
                placeholder="Language"
                name="language"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                options={languageOptions}
                error={
                  !field.state.meta.isValid
                    ? field.state.meta.errors[0]
                    : undefined
                }
              />
            )}
          />
        </FormRow>

        <form.AppForm>
          <MainButton submit>
            {isPending ? <Spinner /> : "Save and Continue"}
          </MainButton>
        </form.AppForm>
      </form>
    </div>
  );
};

export default PersonalAndContactInfo;
