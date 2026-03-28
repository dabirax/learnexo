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
