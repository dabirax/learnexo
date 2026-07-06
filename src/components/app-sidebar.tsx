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
          url: "#",
        },
      ],
    },
    {
      title: "Courses",
      url: "#",
      icon: Layers,
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
      url: "#",
      icon: ChartPie,
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
        <SidebarTrigger />
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
