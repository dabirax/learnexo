import * as React from "react";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type InputProps = React.ComponentProps<"input"> & {
  visibility?: boolean;
};

function Input({ className, type, visibility = false, ...props }: InputProps) {
  const [show, setShow] = React.useState<boolean>(false);

  return (
    <div className="relative group w-full">
      <input
        type={type === "password" && show ? "text" : type}
        data-slot="input"
        className={cn(
          "flex w-full min-w-80 md:min-w-0 rounded-2xl border-2 bg-slate-50/50 px-5 py-4 text-base transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "border-slate-200 placeholder:text-slate-400 text-slate-900",
          "focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10",
          "aria-invalid:border-rose-400 aria-invalid:ring-rose-500/10",
          className,
        )}
        {...props}
      />
      {visibility && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-violet-500 transition-colors z-40 p-1"
        >
          {show ? <EyeIcon size={20} /> : <EyeOffIcon size={20} />}
        </button>
      )}
    </div>
  );
}

export { Input };
