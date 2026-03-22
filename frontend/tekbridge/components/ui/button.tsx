import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "white";
  size?: "md" | "lg" | "nav";
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
    const classes = clsx(
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 rounded-full",
      {
        "bg-accent text-white hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20":
          variant === "primary",
        "bg-transparent border border-border text-text-primary hover:border-text-primary/40 hover:-translate-y-0.5":
          variant === "ghost",
        "bg-white text-hero-dark hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-lg":
          variant === "white",
        "min-h-[40px] px-5 text-[0.8125rem]": size === "nav",
        "min-h-[48px] px-7 text-[0.9375rem]": size === "md",
        "min-h-[56px] px-10 text-[1.05rem]": size === "lg",
      },
      className
    );

    if (href) {
      return (
        <a href={href} className={classes}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
