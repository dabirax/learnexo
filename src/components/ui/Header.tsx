import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { SidebarInset, SidebarTrigger } from "./sidebar";
import { getSessionStorage } from "@/utils/session";
import { useEffect, useState } from "react";

const greetings = [
  { text: "Welcome back", lang: "English" },
  { text: "Kaabo", lang: "Yoruba" },
  { text: "Nnọọ", lang: "Igbo" },
  { text: "Sannu", lang: "Hausa" },
];

const WelcomeText = () => {
  const firstName: string = getSessionStorage("userFirstName") ?? "";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = greetings[currentIndex].text + (firstName ? `, ${firstName}` : "");

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < fullText.length) {
            setDisplayText(fullText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % greetings.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, firstName]);

  return (
    <div className="flex flex-col md:gap-1 items-start w-fit pt-4">
      <p className="font-medium mlg:leading-9.5 mlg:text-[30px] md:leading-6 md:text-xl whitespace-nowrap mlg:mx-auto lg:mx-0 min-h-[1.2em]">
        {displayText}
        <span className="inline-block w-[2px] h-[0.9em] bg-slate-900 ml-0.5 animate-pulse align-middle" />
      </p>
      <p className="text-gray-6 mlg:leading-6 md:leading-4 md:text-sm whitespace-nowrap text-xs mlg:text-base mlg:mx-auto lg:mx-0">
        Your personalized learning management system.
      </p>
    </div>
  );
};

const Header = () => {
  return (
    <div className="w-full flex items-center gap-4 md:gap-6 mx-auto mb-4 border-b fixed top-0 z-20 bg-white pb-4">
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

export const UserImageAndInfo = () => {
  const firstName: string = getSessionStorage("userFirstName") ?? "";
  const lastName: string = getSessionStorage("userLastName") ?? "";
  const role: string = getSessionStorage("userRole") ?? "Student";
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";

  return (
    <div className="border-2 border-gray-4 rounded-full p-1 h-11 flex items-center justify-between gap-3 pr-6 cursor-pointer max-w-[200px]">
      <Link to="./profile">
        <Avatar className="size-9">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex flex-col gap-1">
        <span className="font-semibold tracking-tight leading-none">
          {firstName || "User"}
        </span>
        <span className="leading-none text-sm text-muted-foreground capitalize">
          {role}
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
