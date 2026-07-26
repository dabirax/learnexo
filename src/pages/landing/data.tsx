import ai from "../../assets/images/ai.png";
import gamified from "../../assets/images/gamified.png";
import personalized from "../../assets/images/personalized.png";
import profile from "../../assets/images/profile-circle.png";
import flash from "../../assets/images/flash.png";
import setting from "../../assets/images/setting.png";
import feature1 from "../../assets/images/features-icon-1.png";
import feature2 from "../../assets/images/features-icon-2.png";
import feature3 from "../../assets/images/features-icon-3.png";
import feature4 from "../../assets/images/features-icon-4.png";
import ceejay from "../../assets/images/Ceejay_portrait.png";

export type Info = {
  title: string;
  info: string;
  img: string;
};

export type TeamMemberType = {
  img: string;
  name: string;
  role: string;
  job: string;
  linkedin?: string;
  x?: string;
};

export const howItWorksBentos: Info[] = [
  {
    title: "AI-Generated Learning Paths",
    info: "Lessons on artificial intelligences inclined courses that cover......",
    img: ai,
  },
  {
    title: "Personalized Learning",
    info: "Classes in development that cover the most recent advancements in web.",
    img: personalized,
  },
  {
    title: "Gamified Challenges",
    info: "User Interface Design courses that cover the most recent  trends",
    img: gamified,
  },
];

export const howItWorksSteps: Info[] = [
  {
    title: "Personalize",
    info: "Take a simple assessment. Our AI builds a custom learning path based on your goals and abilities.",
    img: profile,
  },
  {
    title: "Engage",
    info: "Take a simple assessment. Our AI builds a custom learning path based on your goals and abilities.",
    img: setting,
  },
  {
    title: "Grow",
    info: "Take a simple assessment. Our AI builds a custom learning path based on your goals and abilities.",
    img: flash,
  },
];

export const features: Info[] = [
  {
    title: "AI-Powered Recommendations",
    info: "Get smart content suggestions tailored to your goals and performance.",
    img: feature1,
  },
  {
    title: "Gamified Modules",
    info: "Turn learning into a fun, motivating experience with points, badges, and challenges.",
    img: feature2,
  },
  {
    title: "Accessibility-First Design",
    info: "Designed to support all learners, including those with disabilities.",
    img: feature3,
  },
  {
    title: "Adaptive Learning Analytics",
    info: "Track your learning growth and performance with real-time visual insights.",
    img: feature4,
  },
];

export const teamMembers: TeamMemberType[] = [
  {
    name: "Praise Olukiran",
    role: "Full Stack Developer",
    job: "Fullstack Developer at Smart Systems Research Lab",
    img: ceejay,
  },
  {
    name: "Nunsi Shiaki",
    role: "AI Engineer",
    job: "Fullstack Developer at Smart Systems Research Lab",
    img: ceejay,
    linkedin: "https://www.linkedin.com/in/covenant-joshua-5080aa228/",
    x: "https://x.com/daCodeFada",
  },
  
];
