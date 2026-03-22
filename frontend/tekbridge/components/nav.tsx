"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "./ui/container";
import { Button } from "./ui/button";

export function Navigation() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-100 py-4 transition-all duration-300 ${
      scrolled
        ? "bg-white/85 backdrop-blur-xl shadow-[0_1px_0_var(--color-border)]"
        : "bg-transparent"
    }`}>
      <Container>
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 font-bold text-lg tracking-tight group">
            <div className="w-8 h-8 rounded-[6px] bg-accent flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <svg viewBox="0 0 24 24" fill="#fff" className="w-[18px] h-[18px]">
                <path d="M 5 14.5 C 5 9, 8.5 3.5, 12 3 C 15.5 3.5, 19 9, 19 14.5 L 19.8 14.5 L 19.8 19 L 18.2 19 L 18.2 15.2 L 5.8 15.2 L 5.8 19 L 4.2 19 L 4.2 14.5 Z" />
              </svg>
            </div>
            TekBridge
          </a>

          <div className="hidden md:flex items-center gap-4">
            <Button size="nav" onClick={() => scrollTo("contact")}>
              {t("nav_contact")}
            </Button>
          </div>

          <button
            className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-transparent border-none text-text-primary cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? (
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current stroke-2 fill-none">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current stroke-2 fill-none">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/96 backdrop-blur-xl py-4 px-6 border-b border-border shadow-md">
            <Button variant="primary" className="w-full" onClick={() => scrollTo("contact")}>
              {t("nav_contact")}
            </Button>
          </div>
        )}
      </Container>
    </nav>
  );
}
