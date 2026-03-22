import { clsx } from "clsx";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  wide?: boolean;
}

export function Container({ children, className, narrow, wide }: ContainerProps) {
  return (
    <div
      className={clsx(
        "mx-auto px-6",
        narrow ? "max-w-[800px]" : wide ? "max-w-[1400px]" : "max-w-[1200px]",
        className
      )}
    >
      {children}
    </div>
  );
}
