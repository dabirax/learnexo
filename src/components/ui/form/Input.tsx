import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import FieldError from "./FieldError";

type InputProps = {
  placeholder: string;
  type: string;
  name: string;
  half?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  visibility?: boolean;
  error?: string;
  className?: string; // Added for external overrides if needed
};

const Input: React.FC<InputProps> = ({
  placeholder,
  type,
  name,
  half,
  value,
  onChange,
  onBlur,
  onFocus,
  visibility,
  error,
}) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div
      className={`${
        half ? "md:w-[48%] mlg:w-full lgd:w-[48%]" : "w-full"
      } relative flex flex-col gap-1.5`}
    >
      <div className="relative group">
        <input
          className={`
            w-full z-30 min-w-80 md:min-w-0 mlg:min-w-80 lgd:min-w-0
            /* Background & Border */
            bg-slate-50/50 border-2 
            ${error ? "border-rose-400 focus:border-rose-500" : "border-slate-100 focus:border-violet-500"}
            rounded-2xl py-4 px-5 
            /* Text & Placeholder */
            text-slate-900 placeholder:text-slate-400 placeholder:capitalize
            /* Focus States */
            outline-none focus:bg-white focus:ring-4 focus:ring-violet-500/10
            /* Transitions */
            transition-all duration-200 ease-in-out
          `}
          placeholder={placeholder}
          type={type === "password" && show ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />

        {visibility && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer z-40 p-1 rounded-lg text-slate-400 hover:text-violet-500 hover:bg-violet-50 transition-colors"
          >
            {show ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
          </button>
        )}
      </div>

      {error && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          <FieldError>{error}</FieldError>
        </div>
      )}
    </div>
  );
};

export default Input;
