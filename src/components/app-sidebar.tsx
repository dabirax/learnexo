"use client";

import * as React from "react";
import {
  BookCheck,
  ChartPie,
  CopyCheck,
  Layers,
  LayoutDashboardIcon,
  LifeBuoy,
  Settings,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSessionStorage } from "@/utils/session";
import logo from "@/assets/images/Logo-no-bg.png";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Profile",
          url: "/dashboard/profile",
        },
        {
          title: "Notifications",
          url: "#",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
      ],
    },
    {
      title: "Courses",
      url: "/dashboard/courses",
      icon: Layers,
      items: [
        {
          title: "All Courses",
          url: "/dashboard/courses",
        },
      ],
    },
    {
      title: "Assessment",
      url: "/assessment",
      icon: CopyCheck,
      items: [
        {
          title: "Assessment",
          url: "/assessment",
        },
      ],
    },

    {
      title: "Quizzes",
      url: "#",
      icon: BookCheck,
    },

    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: ChartPie,
      items: [
        {
          title: "All Reports",
          url: "/dashboard/reports",
        },
      ],
    },
    {
      title: "Instructors",
      url: "#",
      icon: Users,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const firstName: string = getSessionStorage("userFirstName") ?? "";
  const lastName: string = getSessionStorage("userLastName") ?? "";
  const email: string = getSessionStorage("userEmail") ?? "";

  const user = {
    name: `${firstName} ${lastName}`.trim() || "User",
    email,
    avatar: "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-3">
          <SidebarTrigger />
          <div className="group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500 blur-md opacity-0 group-hover:opacity-15 transition-opacity" />
                <img
                  src={logo}
                  alt="LEARNEXO"
                  className="w-10 h-10 mlg:w-8 mlg:h-8 relative z-10"
                />
              </div>
              <span className="font-inter text-blue-3 font-bold text-2xl mlg:text-md tracking-tighter">
                Lear<span className="text-purple-1">NEXO</span>
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
