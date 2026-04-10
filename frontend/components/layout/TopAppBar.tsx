import Image from "next/image";
import { ReactNode } from "react";
import LogoutButton from "@/components/auth/LogoutButton";

export interface TopAppBarProps {
  title: string;
  subtitle?: ReactNode;
  avatarUrl?: string;
  avatarFallbackIcon?: string;
  actionNode?: ReactNode;
  /** Large title variant (for student dashboard) */
  largeTitle?: boolean;
}

export default function TopAppBar({
  title,
  subtitle,
  avatarUrl,
  avatarFallbackIcon = "person",
  actionNode,
  largeTitle = false,
}: TopAppBarProps) {
  return (
    <header className="bg-surface/90 backdrop-blur-xl top-0 sticky z-50 transition-colors duration-200 ease-in-out border-b border-surface-dim shadow-sm">
      <div className={`flex justify-between items-center w-full px-6 ${largeTitle ? 'py-4' : 'h-16'} max-w-full`}>
        <div className={`flex items-center ${largeTitle ? 'gap-4' : 'gap-3'}`}>
          <div className={`${largeTitle ? 'w-12 h-12 border-2' : 'w-10 h-10 border'} rounded-full overflow-hidden border-primary-container bg-surface-container flex items-center justify-center relative`}>
            {avatarUrl ? (
              <Image 
                src={avatarUrl}
                alt="User Profile"
                fill
                sizes={largeTitle ? "48px" : "40px"}
                className="object-cover"
                suppressHydrationWarning
              />
            ) : (
              <span className={`material-symbols-outlined text-primary ${largeTitle ? 'text-2xl' : 'text-xl'}`}>
                {avatarFallbackIcon}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className={`${largeTitle ? 'font-manrope font-bold text-2xl leading-none mb-1' : 'font-headline font-bold text-lg tracking-tight'} text-primary`}>
              {title}
            </h1>
            {subtitle && (
              <div className="flex items-center gap-2">
                {subtitle}
              </div>
            )}
          </div>
        </div>
        {actionNode ? (
          actionNode
        ) : (
          <LogoutButton />
        )}
      </div>
    </header>
  );
}
