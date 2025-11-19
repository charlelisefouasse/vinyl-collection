import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export type HeaderProps = ComponentProps<"header">;

export const Header = ({ children, className, ...rest }: HeaderProps) => {
  return (
    <header
      className={twMerge(
        "border-b bg-white/80 dark:bg-slate-800/70",
        className
      )}
      {...rest}
    >
      <div className="container mx-auto px-4 py-6">{children}</div>
    </header>
  );
};
