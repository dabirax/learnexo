import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { SidebarInset, SidebarTrigger } from "./sidebar";

// {image, lastname, firstname, role}
// {firstname ? firstname : "UserFirstname"}

const Header = () => {
  return (
    <div className="w-full flex items-center gap-4 md:gap-6 mx-auto mb-4 border-b fixed top-0 bg-white pb-4">
      <div className="flex flex-row-reverse flex-wrap items-center justify-between gap-4">
        <WelcomeText />

        <div className="flex items-center  gap-2 mr-auto md:mr-0">
          <SidebarInset>
            <SidebarTrigger className="rounded-md border-gray-4 p-4 w-11 h-11 hover:scale-105 transition duration-300 ease-in-out border-2 md:hidden" />
          </SidebarInset>

          <NotificationBell />

          <div className="hidden md:block">
            <UserImageAndInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

export const WelcomeText = () => {
  return (
    <div className="flex flex-col md:gap-1 items-start w-fit pt-4">
      <p className="font-medium mlg:leading-9.5 mlg:text-[30px] md:leading-6 md:text-xl whitespace-nowrap mlg:mx-auto lg:mx-0">
        Welcome back, Covenant
      </p>
      <p className="text-gray-6 mlg:leading-6 md:leading-4 md:text-sm whitespace-nowrap text-xs mlg:text-base mlg:mx-auto lg:mx-0">
        Your learning management dashboard.
      </p>
    </div>
  );
};

export const UserImageAndInfo = () => {
  return (
    <div className="border-2 border-gray-4 rounded-full p-1 h-11 flex items-center justify-between gap-3 pr-6 cursor-pointer max-w-[200px]">
      <Link to="./profile">
        <Avatar className="size-9">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CJ</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex flex-col gap-1">
        <span className="font-semibold tracking-tight leading-none">
          Covenant
        </span>
        <span className="leading-none text-sm text-muted-foreground">
          Student
        </span>
      </div>
    </div>
  );
};

export const NotificationBell = () => {
  return (
    <div className="border-2 border-gray-4 rounded-lg p-1.5 w-11 h-11 flex items-center justify-center hover:scale-105 transition duration-300 ease-in-out">
      <Bell color="#BBBBBB" />
    </div>
  );
};
