"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { FadeIn } from "./motion";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "white" | "alt" | "dark";
  container?: "default" | "narrow" | "wide" | "full";
}

const backgroundStyles = {
  white: "bg-bg",
  alt: "bg-bg-alt",
  dark: "bg-hero-dark text-hero-text",
};

const containerStyles = {
  default: "max-w-5xl mx-auto px-6",
  narrow: "max-w-3xl mx-auto px-6",
  wide: "max-w-7xl mx-auto px-6",
  full: "px-6",
};

export function Section({
  children,
  className,
  id,
  background = "white",
  container = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={clsx(
        "py-24 md:py-32 lg:py-40",
        backgroundStyles[background],
        className
      )}
    >
      <div className={containerStyles[container]}>{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ title, subtitle, centered = true, className }: SectionHeaderProps) {
  return (
    <div className={clsx(centered && "text-center", "mb-16", className)}>
      <FadeIn>
        <h2 className="mb-4">{title}</h2>
      </FadeIn>
      {subtitle && (
        <FadeIn delay={0.1}>
          <p className={clsx("text-lg text-text-faint", centered && "max-w-2xl mx-auto")}>
            {subtitle}
          </p>
        </FadeIn>
      )}
    </div>
  );
}
