import { useLocation, useNavigate } from "react-router-dom";
import PageProgress from "../../../../components/ui/form/PageProgress";
import HeaderText from "../../components/HeaderText";
import { removeAndReturn } from "@/utils/funcs";
import { classOptions, gradeOptions } from "../../service";
import { useMutation } from "@tanstack/react-query";
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
import { ArrowRight, GraduationCap, School } from "lucide-react";
import { onboardingRequest } from "@/services/onboarding/requests";

const formSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  studentClass: z.string().min(1, "Please select your class"),
  schoolAddress: z.string().min(1, "School address is required"),
  firstTerm: z.string().min(1, "First term grade is required"),
  secondTerm: z.string().min(1, "Second term grade is required"),
  thirdTerm: z.string().min(1, "Third term grade is required"),
});

const SchoolAndLearning = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevValue = location.state?.prevValue || {};

  const { mutate: submitOnboarding, isPending } = useMutation({
    mutationFn: onboardingRequest,
    onSuccess: () => {
      toast.success("Profile saved! Starting your assessment...");
      setTimeout(() => navigate("../questionnaire"), 1000);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onboardingForm = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      schoolName: "",
      studentClass: "",
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

    const all = { ...prevValue, ...value, pastExam };

    const formData = new FormData();
    formData.append("dateOfBirth", all.dateOfBirth ?? "");
    formData.append("gender", all.gender ?? "");
    formData.append("town", all.town ?? "");
    formData.append("state", all.state ?? "");
    formData.append("stateOfOrigin", all.stateOfOrigin ?? "");
    formData.append("residentialAddress", all.residentialAddress ?? "");
    formData.append("language", all.language ?? "");
    formData.append("schoolName", all.schoolName ?? "");
    formData.append("studentClass", all.studentClass ?? "");
    formData.append("schoolAddress", all.schoolAddress ?? "");
    formData.append("pastExam", JSON.stringify(pastExam));
    if (all.photo instanceof File) {
      formData.append("photo", all.photo);
    }

    submitOnboarding(formData);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="space-y-6">
        <PageProgress totalSteps={2} step={2} />
        <HeaderText
          title="School"
          description="Help us build your perfect learning path by sharing your academic background."
        />
      </div>

      <Form {...onboardingForm}>
        <form
          className="w-full space-y-10"
          onSubmit={onboardingForm.handleSubmit(onSubmit)}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-violet-600 mb-2">
              <School size={18} />
              <h3 className="text-sm font-bold uppercase tracking-widest">
                School Details
              </h3>
            </div>

            <FormField
              control={onboardingForm.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Current School Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Selector
              name="studentClass"
              title="Your Class"
              options={classOptions}
            />

            <FormField
              control={onboardingForm.control}
              name="schoolAddress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="School Address (City, State)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-slate-50/50 p-6 rounded-[2rem] border-2 border-slate-100 space-y-12">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <GraduationCap size={18} />
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Past Examination Grades
              </h3>
            </div>

            <div className="grid grid-cols-1 lgd:grid-cols-3 gap-4 mt-6">
              <Selector
                name="firstTerm"
                title="1st Term"
                options={gradeOptions}
              />
              <Selector
                name="secondTerm"
                title="2nd Term"
                options={gradeOptions}
              />
              <Selector
                name="thirdTerm"
                title="3rd Term"
                options={gradeOptions}
              />
            </div>
            <p className="text-[11px] text-slate-400 italic px-1">
              * We use these to calibrate your initial learning track
              difficulty.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group transform active:scale-[0.98]"
          >
            {isPending ? <Spinner /> : "Proceed to Questionnaire"}
            {!isPending && (
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={20}
              />
            )}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default SchoolAndLearning;
