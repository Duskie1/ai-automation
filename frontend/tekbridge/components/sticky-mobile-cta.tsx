"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function StickyMobileCTA() {
  const t = useTranslations();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("section");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const scrollTo = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 p-3 px-4 bg-hero-dark/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.15)] z-[90] hidden max-md:block translate-y-full transition-transform duration-[350ms] ease-[var(--ease)] ${
        visible ? "!translate-y-0" : ""
      }`}
    >
      <button
        onClick={scrollTo}
        className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 font-semibold bg-white text-hero-dark rounded-full hover:bg-white/90 transition-all duration-300 cursor-pointer text-[0.9375rem] outline-none focus-visible:ring-2 focus-visible:ring-accent-brand focus-visible:ring-offset-2"
      >
        {t("hero_cta2")}
      </button>
    </div>
  );
}
