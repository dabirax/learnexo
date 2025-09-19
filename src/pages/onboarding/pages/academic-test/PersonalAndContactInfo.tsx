import { useNavigate } from "react-router-dom";
import PageProgress from "../../../../components/ui/form/PageProgress";
import MainButton from "../../../../components/ui/MainButton";
import HeaderText from "../../components/HeaderText";
import ImagePlaceholder from "../../components/ImagePlaceholder";
import { genderOptions, languageOptions } from "../../service";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  dateOfBirth: z.date().refine((val) => val !== null && val !== undefined, {
    message: "Date of birth is required",
  }),
  gender: z.string().nonempty("This field is required"),
  residentialAddress: z.string().nonempty("This field is required"),
  town: z.string().nonempty("This field is required"),
  state: z.string().nonempty("This field is required"),
  stateOfOrigin: z.string().nonempty("This field is required"),
  language: z.string().nonempty("This field is required"),
  photo: z.string(),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
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
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    console.log("Okay");
    const dobISO = value.dateOfBirth.toISOString();
    let prevValue = { ...value, dateOfBirth: dobISO };

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
        setTimeout(() => {
          navigate("../schoolandlearning", { state: { prevValue } });
        }, 2000);
        return;
      }
    } else {
      toast.error("Choose an image");
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <PageProgress totalSteps={2} step={1} />
      <HeaderText
        title="Personal & Contact Information"
        description="Tell us about yourself so we can personalize your learning experience!"
      />
      <ImagePlaceholder setSelected={setSelectedImage} />

      <Form {...form}>
        <form
          className="w-full space-y-6 max-w-md mx-auto"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`w-full py-5 pl-3 text-left ${
                          !field.value && "text-muted-foreground"
                        }`}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Date of birth"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
                <FormMessage />
              </FormItem>
            )}
          />

          <Selector
            name="gender"
            title="Select gender"
            options={genderOptions}
          />

          <FormField
            control={form.control}
            name="residentialAddress"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Residential address"
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
            name="town"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Town"
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
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="State"
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
            name="stateOfOrigin"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="State of origin"
                    className=""
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Selector
            name="language"
            title="Select language"
            options={languageOptions}
          />

          <MainButton submit>
            {isPending ? <Spinner /> : "Save and Continue"}
          </MainButton>
        </form>
      </Form>
    </div>
  );
};

export default PersonalAndContactInfo;
