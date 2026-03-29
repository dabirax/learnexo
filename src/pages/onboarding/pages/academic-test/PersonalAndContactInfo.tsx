import { useNavigate } from "react-router-dom";
import PageProgress from "../../../../components/ui/form/PageProgress";
import HeaderText from "../../components/HeaderText";
import ImagePlaceholder from "../../components/ImagePlaceholder";
import { genderOptions, languageOptions } from "../../service";
import { useState} from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadImageRequest } from "@/utils/queries/auth";
import Spinner from "@/components/ui/Spinner";
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
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar as CalendarIcon,
  MapPin,
  User,
  ArrowRight,
} from "lucide-react";

const formSchema = z.object({
  dateOfBirth: z.date().refine((val) => val !== null && val !== undefined, {
    message: "Date of birth is required",
  }),
  gender: z.string().min(1, "Please select your gender"),
  residentialAddress: z.string().min(1, "Address is required"),
  town: z.string().min(1, "Town is required"),
  state: z.string().min(1, "State is required"),
  stateOfOrigin: z.string().min(1, "State of origin is required"),
  language: z.string().min(1, "Please select a language"),
  photo: z.string().optional(),
});

const PersonalAndContactInfo = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { mutate: uploadPhoto, isPending } = useMutation({
    mutationFn: uploadImageRequest,
    onSuccess: (response) => {
      toast.success("Profile photo uploaded!");
      const values = form.getValues();
      const prevValue = {
        ...values,
        dateOfBirth: values.dateOfBirth.toISOString(),
        photo: response.data.secure_url,
      };
      setTimeout(
        () => navigate("../schoolandlearning", { state: { prevValue } }),
        1500,
      );
    },
    onError: (error: any) => toast.error(error.message),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateOfBirth: new Date(),
      gender: "",
      residentialAddress: "",
      town: "",
      state: "",
      stateOfOrigin: "",
      language: "",
      photo: "",
    },
  });

  const onSubmit = async () => {
    if (!selectedImage) {
      toast.error("Please upload a profile photo to continue");
      return;
    }
    uploadPhoto(selectedImage);
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
        <ImagePlaceholder setSelected={setSelectedImage} />
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <button
                            type="button"
                            className={`flex w-full items-center gap-3 rounded-2xl border-2 bg-slate-50/50 px-5 py-4 text-left transition-all hover:border-slate-200 focus:border-violet-500 outline-none ${
                              !field.value ? "text-slate-400" : "text-slate-900"
                            } border-slate-200 h-full`}
                          >
                            <CalendarIcon
                              size={18}
                              className="text-slate-400"
                            />
                            <span className="text-xs font-medium">
                              {field.value
                                ? format(field.value, "PPP")
                                : "Date of Birth"}
                            </span>
                          </button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 rounded-2xl border-slate-200 shadow-2xl"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
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
            disabled={isPending}
            className="w-full bg-slate-900 hover:bg-violet-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-200 hover:shadow-violet-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group transform active:scale-[0.98]"
          >
            {isPending ? <Spinner /> : "Save and Continue"}
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

export default PersonalAndContactInfo;
