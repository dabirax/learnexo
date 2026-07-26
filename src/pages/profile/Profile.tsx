import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "@/services/api";
import { getSessionStorage, setSessionStorage } from "@/utils/session";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocumentTitle } from "@/utils/hooks/useDocumentTitle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Selector } from "@/components/ui/form/Selector";
import ImagePlaceholder from "@/pages/onboarding/components/ImagePlaceholder";
import {
  genderOptions,
  languageOptions,
  classOptions,
  gradeOptions,
} from "@/pages/onboarding/service";
import {
  BookOpen,
  Brain,
  Check,
  EditIcon,
  GraduationCap,
  MapPin,
  RefreshCw,
  School,
  User,
  X,
} from "lucide-react";
import CourseProgress from "@/components/ui/dashboard/CourseProgress";
import { profileCourseProgress } from "@/utils/lib/profile";

const editSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  dateOfBirth: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  residentialAddress: z.string().min(1, "Required"),
  town: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  stateOfOrigin: z.string().min(1, "Required"),
  language: z.string().min(1, "Required"),
  schoolName: z.string().min(1, "Required"),
  studentClass: z.string().min(1, "Required"),
  schoolAddress: z.string().min(1, "Required"),
  firstTerm: z.string().min(1, "Required"),
  secondTerm: z.string().min(1, "Required"),
  thirdTerm: z.string().min(1, "Required"),
});

type OnboardingData = {
  dateOfBirth?: string;
  studentClass?: string;
  gender?: string;
  stateOfOrigin?: string;
  residentialAddress?: string;
  town?: string;
  state?: string;
  schoolName?: string;
  schoolAddress?: string;
  language?: string;
  photo?: string | null;
  learningProfile?: {
    learningStyle?: string;
    cognitiveScore?: number;
    explanation?: string;
  };
  pastExam?: { firstTerm?: string; secondTerm?: string; thirdTerm?: string };
};

const gradeLabel: Record<string, string> = {
  A: "75% – 100%",
  B: "65% – 74%",
  C: "60% – 64%",
  D: "45% – 49%",
  E: "40% – 44%",
  F: "0% – 39%",
  nil: "Nil",
};

const apiOrigin = (import.meta.env.VITE_API_BASE_URL as string).replace(
  /\/api\/v1\/?$/,
  "",
);

const today = new Date().toISOString().split("T")[0];

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const toDateInputValue = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const Profile = () => {
  useDocumentTitle("Profile");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const firstName: string = getSessionStorage("userFirstName") ?? "";
  const lastName: string = getSessionStorage("userLastName") ?? "";
  const email: string = getSessionStorage("userEmail") ?? "";
  const role: string = getSessionStorage("userRole") ?? "";
  const userId: string = getSessionStorage("userId") ?? "";

  const { data: onboardingData, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => makeRequest<{ data: OnboardingData }>(`/auth/profile`),
    enabled: !!userId,
    retry: false,
  });

  const onboarding = (onboardingData as { data?: OnboardingData } | undefined)
    ?.data;

  const form = useForm<z.infer<typeof editSchema>>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      firstName,
      lastName,
      email,
      dateOfBirth: "",
      gender: "",
      residentialAddress: "",
      town: "",
      state: "",
      stateOfOrigin: "",
      language: "",
      schoolName: "",
      studentClass: "",
      schoolAddress: "",
      firstTerm: "",
      secondTerm: "",
      thirdTerm: "",
    },
  });

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof editSchema>) => {
      const {
        firstName,
        lastName,
        email,
        firstTerm,
        secondTerm,
        thirdTerm,
        ...onboardingFields
      } = values;

      const formData = new FormData();
      Object.entries(onboardingFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append(
        "pastExam",
        JSON.stringify({ firstTerm, secondTerm, thirdTerm }),
      );
      if (photoFile) formData.append("photo", photoFile);

      await Promise.all([
        makeRequest("/auth/profile", "PATCH", { firstName, lastName, email }),
        makeRequest("/auth/onboarding", "POST", formData),
      ]);
    },
    onSuccess: (_, values) => {
      setSessionStorage("userFirstName", values.firstName);
      setSessionStorage("userLastName", values.lastName);
      setSessionStorage("userEmail", values.email);
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      toast.success("Profile updated!");
      setIsEditing(false);
      setPhotoFile(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleEditOpen = () => {
    form.reset({
      firstName,
      lastName,
      email,
      dateOfBirth: toDateInputValue(onboarding?.dateOfBirth),
      gender: onboarding?.gender ?? "",
      residentialAddress: onboarding?.residentialAddress ?? "",
      town: onboarding?.town ?? "",
      state: onboarding?.state ?? "",
      stateOfOrigin: onboarding?.stateOfOrigin ?? "",
      language: onboarding?.language ?? "",
      schoolName: onboarding?.schoolName ?? "",
      studentClass: onboarding?.studentClass ?? "",
      schoolAddress: onboarding?.schoolAddress ?? "",
      firstTerm: onboarding?.pastExam?.firstTerm ?? "",
      secondTerm: onboarding?.pastExam?.secondTerm ?? "",
      thirdTerm: onboarding?.pastExam?.thirdTerm ?? "",
    });
    setPhotoFile(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPhotoFile(null);
  };

  const onSubmit = (values: z.infer<typeof editSchema>) => {
    const crucialChanged =
      values.email !== email ||
      values.dateOfBirth !== toDateInputValue(onboarding?.dateOfBirth);

    if (crucialChanged) {
      const confirmed = window.confirm(
        "You're changing your email and/or date of birth. These are used for login and to calibrate your learning track. Continue?",
      );
      if (!confirmed) return;
    }

    saveProfile(values);
  };

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
  const fullName = `${firstName} ${lastName}`.trim();
  const photoUrl = onboarding?.photo
    ? `${apiOrigin}${onboarding.photo}`
    : undefined;

  return (
    <div className="max-w-4xl mx-auto pt-10 px-6 pb-20 dark:text-white">
      {/* Header row */}
      <div className="flex justify-between w-full items-start pb-6">
        <div className="flex items-center gap-5">
          <Avatar className="w-20 h-20 rounded-full border-2 border-violet-100">
            {photoUrl && <AvatarImage src={photoUrl} alt={fullName} />}
            <AvatarFallback className="bg-violet-100 text-violet-700 text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{fullName || "—"}</h2>
            <p className="text-sm font-medium text-violet-600 capitalize">{role || "Student"}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">{email}</p>
          </div>
        </div>

        {!isEditing ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleEditOpen}>
                <EditIcon size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit profile</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleCancel}>
                  <X size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cancel</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                  disabled={isPending}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isPending ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save changes</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      <Separator />

      {/* Edit form */}
      {isEditing && (
        <div className="py-8">
          <Form {...form}>
            <form
              className="space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-violet-600">
                  <User size={15} />
                  <h3 className="text-sm font-bold uppercase tracking-widest">
                    Basic Info
                  </h3>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <ImagePlaceholder
                    setSelected={setPhotoFile}
                    initialPreview={photoUrl ?? null}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
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
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormControl>
                            <Input
                              placeholder="Email address"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Personal Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <MapPin size={15} />
                  <h3 className="text-sm font-bold uppercase tracking-widest">
                    Personal Info
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Selector
                    name="gender"
                    title="Gender"
                    options={genderOptions}
                  />
                  <FormField
                    control={form.control}
                    name="residentialAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormControl>
                          <Input placeholder="Residential Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="town"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Town / City" {...field} />
                        </FormControl>
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stateOfOrigin"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="State of Origin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Selector
                    name="language"
                    title="Preferred Language"
                    options={languageOptions}
                  />
                </div>
              </div>

              <Separator />

              {/* Academic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <School size={15} />
                  <h3 className="text-sm font-bold uppercase tracking-widest">
                    Academic Info
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
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
                    control={form.control}
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
              </div>

              <Separator />

              {/* Past exam grades */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <GraduationCap size={15} />
                  <h3 className="text-sm font-bold uppercase tracking-widest">
                    Past Exam Grades
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Info grid */}
      {!isEditing && (
        <div className="py-8 flex flex-wrap gap-12">
          {/* Personal info */}
          <div className="min-w-48">
            <div className="flex items-center gap-2 text-amber-600 mb-4">
              <User size={15} />
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Personal Info
              </h3>
            </div>
            {isLoading ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Loading…</p>
            ) : (
              <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 text-sm">
                <p className="text-slate-500 dark:text-slate-400">Date of Birth:</p>
                <p className="font-medium">{formatDate(onboarding?.dateOfBirth)}</p>
                <p className="text-slate-500 dark:text-slate-400">Gender:</p>
                <p className="font-medium capitalize">{onboarding?.gender ?? "—"}</p>
                <p className="text-slate-500 dark:text-slate-400">State of Origin:</p>
                <p className="font-medium">{onboarding?.stateOfOrigin ?? "—"}</p>
                <p className="text-slate-500 dark:text-slate-400">Town:</p>
                <p className="font-medium">{onboarding?.town ?? "—"}</p>
                <p className="text-slate-500 dark:text-slate-400">Address:</p>
                <p className="font-medium">{onboarding?.residentialAddress ?? "—"}</p>
              </div>
            )}
          </div>

          {/* Academic info */}
          <div className="min-w-48">
            <div className="flex items-center gap-2 text-violet-600 mb-4">
              <BookOpen size={15} />
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Academic Info
              </h3>
            </div>
            {isLoading ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Loading…</p>
            ) : (
              <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 text-sm">
                <p className="text-slate-500 dark:text-slate-400">Class:</p>
                <p className="font-medium">{onboarding?.studentClass ?? "—"}</p>
                <p className="text-slate-500 dark:text-slate-400">School:</p>
                <p className="font-medium">{onboarding?.schoolName ?? "—"}</p>
                <p className="text-slate-500 dark:text-slate-400">School Address:</p>
                <p className="font-medium">{onboarding?.schoolAddress ?? "—"}</p>
                <p className="text-slate-500 dark:text-slate-400">State:</p>
                <p className="font-medium">{onboarding?.state ?? "—"}</p>
                <p className="text-slate-500 dark:text-slate-400">Language:</p>
                <p className="font-medium capitalize">
                  {onboarding?.language ?? "—"}
                </p>
              </div>
            )}
          </div>

          {/* Learning profile */}
          <div className="min-w-64 max-w-sm">
            <div className="flex items-center gap-2 text-emerald-600 mb-4">
              <Brain size={15} />
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Learning Profile
              </h3>
            </div>
            {isLoading ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">Loading…</p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 text-sm">
                  <p className="text-slate-500 dark:text-slate-400">Style:</p>
                  <p className="font-medium capitalize">
                    {onboarding?.learningProfile?.learningStyle ?? "—"}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">Cognitive Score:</p>
                  <p className="font-medium">
                    {onboarding?.learningProfile?.cognitiveScore != null
                      ? `${onboarding.learningProfile.cognitiveScore}%`
                      : "—"}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">Account:</p>
                  <p className="font-medium">Free</p>
                </div>
                {onboarding?.learningProfile?.explanation && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-xl px-4 py-3">
                    {onboarding.learningProfile.explanation}
                  </p>
                )}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 mt-4"
              onClick={() => navigate("/dashboard/questionnaire")}
            >
              <RefreshCw size={14} />
              Retake Questionnaire
            </Button>
          </div>

          {/* Progress */}
          <div className="flex-1 min-w-56">
            <CourseProgress
              title="Progress Overview"
              courses={profileCourseProgress}
            />
          </div>
        </div>
      )}

      <Separator />

      {/* Past exam grades */}
      {!isEditing && onboarding?.pastExam && (
        <>
          <div className="py-8">
            <div className="flex items-center gap-2 text-slate-500 mb-4">
              <GraduationCap size={15} />
              <h3 className="text-sm font-bold uppercase tracking-widest">
                Past Exam Grades
              </h3>
            </div>
            <div className="flex gap-4 flex-wrap">
              {[
                { label: "1st Term", key: "firstTerm" },
                { label: "2nd Term", key: "secondTerm" },
                { label: "3rd Term", key: "thirdTerm" },
              ].map(({ label, key }) => {
                const raw = onboarding.pastExam?.[key as keyof typeof onboarding.pastExam];
                return (
                  <div
                    key={key}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-8 py-5 text-center min-w-28"
                  >
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{label}</p>
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      {raw ? (gradeLabel[raw] ?? raw) : "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <Separator />
        </>
      )}
    </div>
  );
};

export default Profile;
