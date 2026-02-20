import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { LogoFull } from "@/components/ui/logo-full";
import { Logo } from "@/components/ui/logo";
import { UserDropdown } from "@/components/user-dropdown";

export type HeaderProps = ComponentProps<"header"> & {
  hideLogo?: boolean;
  logoFull?: boolean;
  hideUserDropdown?: boolean;
};

export const Header = ({
  children,
  className,
  hideLogo = false,
  logoFull = false,
  hideUserDropdown = false,
  ...rest
}: HeaderProps) => {
  return (
    <header className={twMerge("border-b bg-header", className)} {...rest}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-4 md:gap-8 w-full">
            {!hideLogo && (
              <Link
                href="/"
                className="hover:opacity-80 transition-opacity shrink-0 flex items-center"
              >
                {logoFull ? (
                  <LogoFull
                    width={107}
                    height={32}
                    className="h-10 md:h-12 w-auto text-black dark:text-slate-100"
                  />
                ) : (
                  <Logo
                    width={35}
                    height={32}
                    className="h-10 md:h-12 w-auto text-black dark:text-slate-100"
                  />
                )}
              </Link>
            )}
            {children}
          </div>

          <div className="flex items-center gap-4">
            {!hideUserDropdown && <UserDropdown />}
          </div>
        </div>
      </div>
    </header>
  );
};
