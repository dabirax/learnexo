import React from "react";
import Aside from "../pages/onboarding/components/Aside";
import { Outlet, useNavigate } from "react-router-dom";
import { MoveLeftIcon } from "lucide-react";

const OnboardingLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col mlg:flex-row w-full max-w-screen mlg:min-h-[580px] h-screen mlg:h-auto">
      <Aside />

      <main className="bg-white pt-5 p-8 md:pt-10 mlg:pt-[60px] md:p-25 mlg:p-14 lgd:p-25 w-full flex-1 flex flex-col">
        <div
          className="flex w-fit gap-4 items-center mb-8 mlg:mb-[50px] hover:cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <MoveLeftIcon strokeWidth={1.14} className="hover:scale-110" />
          <span>Back</span>
        </div>

        <div className="flex-1 flex items-center sm:flex-col md:flex-row ">
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingLayout;

import Logo from "../../../components/ui/Logo.tsx";

const Aside = () => {
  return (
    <div className="mlg:w-[47.6vw] mlg:h-screen mlg:min-h-[580px] mlg:max-h-screen bg-[#F7F9FC] p-12 lgd:p-25 mlg:pb-[10vh] flex flex-col justify-between mlg:sticky top-0 left-0">
      <Logo />

      <div className="hidden font-dmsans mlg:flex flex-col w-fit gap-4">
        <p className="text-blue-5 font-bold text-2xl mlg:text-[2.5rem] mlg:leading-[52px]">
          We use AI to personalize your learning experience.
        </p>

        <p className="text-blue-6 leading-[31px]">
          Let's build your learning path.
        </p>
      </div>
    </div>
  );
};

export default Aside;

