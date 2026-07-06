import { useNavigate } from "react-router-dom";
import PageProgress from "../../../../components/ui/form/PageProgress";
import HeaderText from "../../components/HeaderText";
import ImagePlaceholder from "../../components/ImagePlaceholder";
import { genderOptions, languageOptions } from "../../service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/form/Selector";
import { MapPin, User, ArrowRight } from "lucide-react";
import {
  getOnboardingDraft,
  saveOnboardingDraft,
  setOnboardingPhoto,
  getOnboardingPhotoPreview,
} from "../../onboardingDraft";

const today = new Date().toISOString().split("T")[0];

const formSchema = z.object({
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
  gender: z.string().min(1, "Please select your gender"),
  residentialAddress: z.string().min(1, "Address is required"),
  town: z.string().min(1, "Town is required"),
  state: z.string().min(1, "State is required"),
  stateOfOrigin: z.string().min(1, "State of origin is required"),
  language: z.string().min(1, "Please select a language"),
});

const PersonalAndContactInfo = () => {
  const navigate = useNavigate();
  const draft = getOnboardingDraft();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfBirth: draft.dateOfBirth ?? "",
      gender: draft.gender ?? "",
      residentialAddress: draft.residentialAddress ?? "",
      town: draft.town ?? "",
      state: draft.state ?? "",
      stateOfOrigin: draft.stateOfOrigin ?? "",
      language: draft.language ?? "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    saveOnboardingDraft(data);
    navigate("../schoolandlearning");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="space-y-6">
        <PageProgress totalSteps={2} step={1} />
        <HeaderText
          title="Personal Information"
          description="Tell us about yourself so we can personalize your learning experience!"
        />
      </div>

      <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
        <ImagePlaceholder
          setSelected={setOnboardingPhoto}
          initialPreview={getOnboardingPhotoPreview()}
        />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-4">
          Upload Student Photo
        </p>
      </div>

      <Form {...form}>
        <form
          className="w-full space-y-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-violet-600">
              <User size={18} />
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        max={today}
                        min="1990-01-01"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500 ml-1" />
                  </FormItem>
                )}
              />
              <Selector name="gender" title="Gender" options={genderOptions} />
            </div>
            <Selector
              name="language"
              title="Preferred Language"
              options={languageOptions}
            />
          </div>

          {/* Section: Location */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-emerald-600">
              <MapPin size={18} />
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Location Details
              </h3>
            </div>

            <FormField
              control={form.control}
              name="residentialAddress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Residential Address" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500 ml-1" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="town"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Town / City" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500 ml-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-rose-500 ml-1" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="stateOfOrigin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="State of Origin" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs text-rose-500 ml-1" />
                </FormItem>
              )}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group transform active:scale-[0.98]"
          >
            Save and Continue
            <ArrowRight
              className="group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </button>
        </form>
      </Form>
    </div>
  );
};

export default PersonalAndContactInfo;
