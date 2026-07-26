import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "./sidebar";
import { getSessionStorage } from "@/utils/session";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/images/Logo-no-bg.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 px-4 flex items-center justify-between transition-colors">
      <Link to="/dashboard" className="flex items-center gap-3 shrink-0">
        <div className="relative">
          <img
            src={logo}
            alt="LEARNEXO"
            className="w-10 h-10 relative z-10"
          />
        </div>
        <span className="font-inter text-blue-3 font-bold text-2xl tracking-tighter">
          Lear<span className="text-purple-1">NEXO</span>
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden h-9 w-9 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0" />

        <div className="shrink-0">
          <ThemeToggle />
        </div>

        <div className="shrink-0">
          <NotificationBell />
        </div>

        <div className="shrink-0">
          <UserImageAndInfo />
        </div>
      </div>
    </header>
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
    <div className="border border-slate-200 dark:border-slate-700 rounded-full p-1 h-11 flex items-center gap-3 pr-6 cursor-pointer shrink-0">
      <Link to="./profile">
        <Avatar className="size-9">
          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex flex-col gap-1">
        <span className="font-semibold tracking-tight leading-none text-slate-900 dark:text-white">
          {firstName || "User"}
        </span>
        <span className="leading-none text-sm text-slate-500 dark:text-slate-400 capitalize">
          {role}
        </span>
      </div>
    </div>
  );
};

export const NotificationBell = () => {
  return (
    <button className="flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all shrink-0">
      <Bell className="text-slate-400 dark:text-slate-500" size={18} />
    </button>
  );
};
