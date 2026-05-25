import { useLocation, useNavigate } from "react-router-dom";
import PageProgress from "../../../../components/ui/form/PageProgress";
import MainButton from "../../../../components/ui/MainButton";
import HeaderText from "../../components/HeaderText";
import { removeAndReturn } from "@/utils/funcs";
import {
  classOptions,
  gradeOptions,
  learningStyleOptions,
} from "../../service";
import { useMutation } from "@tanstack/react-query";
import { onboardingRequest } from "@/utils/queries/auth";
import { useEffect } from "react";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/form/Selector";

const formSchema = z.object({
  schoolName: z.string().nonempty("This field is required"),
  class: z.string().nonempty("This field is required"),
  learningStyle: z.string().nonempty("This field is required"),
  schoolAddress: z.string().nonempty("This field is required"),
  firstTerm: z.string().nonempty("This field is required"),
  secondTerm: z.string().nonempty("This field is required"),
  thirdTerm: z.string().nonempty("This field is required"),
});

const SchoolAndLearning = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const { prevValue } = location.state;
  // console.log(prevValue);

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

  const onboardingForm = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      schoolName: "",
      class: "",
      learningStyle: "",
      schoolAddress: "",
      firstTerm: "",
      secondTerm: "",
      thirdTerm: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    const pastExam = {
      firstTerm: removeAndReturn(value, "firstTerm"),
      secondTerm: removeAndReturn(value, "secondTerm"),
      thirdTerm: removeAndReturn(value, "thirdTerm"),
    };
    const newValue = { ...value, pastExam, ...prevValue };
    console.log(newValue);
    onboardingMutation(newValue);
  };

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

      <Form {...onboardingForm}>
        <form
          className="w-full space-y-6"
          onSubmit={onboardingForm.handleSubmit(onSubmit)}
        >
          <FormField
            control={onboardingForm.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="School name"
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Selector name="class" title="Class" options={classOptions} />

          <Selector
            name="learningStyle"
            title="Preferred learning style"
            options={learningStyleOptions}
          />

          <FormField
            control={onboardingForm.control}
            name="schoolAddress"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="School address"
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="font-medium text-[22px] text-blue-5">
            Past Examination Grade
          </p>

          <Selector
            name="firstTerm"
            title="First term grade"
            options={gradeOptions}
          />

          <Selector
            name="secondTerm"
            title="Second term grade"
            options={gradeOptions}
          />

          <Selector
            name="thirdTerm"
            title="Third term grade"
            options={gradeOptions}
          />
          <MainButton /*submit*/ onClick={()=>{navigate("../choosesubject");}}>
            {isPending ? <Spinner /> : "Proceed to take Test"}
          </MainButton>
        </form>
      </Form>
    </div>
  );
};

export default SchoolAndLearning;
