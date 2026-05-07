import React from "react";
import type { ChildrenProps } from "../../../utils/types/baseTypes";

type HeaderTextProps = Partial<ChildrenProps> & {
  title: string;
  description?: string;
};

const HeaderText: React.FC<HeaderTextProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <div className="space-y-2 mb-10">
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
        {title}
      </h1>
      <p className="text-slate-500 font-medium">
        {description} {children}
      </p>
    </div>
  );
};

export default HeaderText;
