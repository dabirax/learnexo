import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import ImageAndInfo from "@/components/ui/profile/ImageAndInfo";
import { Separator } from "@/components/ui/separator";
import BasicInfo from "@/components/ui/profile/BasicInfo";
import CourseProgress from "@/components/ui/dashboard/CourseProgress";
import { profileCourseProgress } from "@/utils/lib/profile";
// import cours

const Profile = () => {
  return (
    <div className="mr-24 pt-12 ml-4">
      <div className="flex justify-between w-full items-start pb-4">
        <ImageAndInfo />

        <Button>
          <EditIcon />
          Edit Profile
        </Button>
      </div>
      <Separator />

      <div className="py-12 flex justify-between">
        <BasicInfo />
        <CourseProgress
          title="Progress Overview"
          courses={profileCourseProgress}
        />
      </div>
      <Separator />

      <div className="text-gray-6 leading-3.5 py-6 flex justify-between">
        <p>
          <span className="font-semibold leading-5 text-black">
            Account type
          </span>
          : Free
        </p>
        <p>
          <span className="font-semibold leading-5 text-black">
            Learning Style
          </span>
          : Visual, Auditory
        </p>
      </div>
      <Separator />

      <div className="py-6">
        <div className="flex gap-3 items-start">
          <p className="font-semibold leading-5 text-black">Interests:</p>
          <p className="text-gray-6 leading-5 wrap-normal max-w-80">
            Mathematics, Music, AI & Machine Learning, English, Economics,
            Leadership
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
