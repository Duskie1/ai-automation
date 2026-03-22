"use client";

import { useTranslations } from "next-intl";
import { Container } from "../ui/container";
import { ScrollReveal } from "../ui/scroll-reveal";

export function HowItWorks() {
  const t = useTranslations();

  const steps = [
    {
      num: 1,
      title: t("wf1_title"),
      desc: t("wf1_desc"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
      color: "bg-accent-brand-soft text-accent-brand border-accent-brand/20",
    },
    {
      num: 2,
      title: t("wf2_title"),
      desc: t("wf2_desc"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      ),
      color: "bg-green-soft text-green border-green/20",
    },
    {
      num: 3,
      title: t("wf3_title"),
      desc: t("wf3_desc"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </svg>
      ),
      color: "bg-[#fef3c7] text-[#d97706] border-[#d97706]/20",
    },
  ];

  return (
    <section id="how-it-works" className="py-[clamp(64px,12vw,96px)]">
      <Container>
        <ScrollReveal>
          <h2 className="text-center mb-4">{t("how_title")}</h2>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p className="text-center text-text-faint max-w-[560px] mx-auto mb-12 leading-[1.65]">
            {t("how_desc")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="flex flex-col md:flex-row gap-4 md:gap-0">
            {steps.map((step, i) => (
              <div key={step.num} className="flex-1 relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+32px)] right-0 w-full h-px bg-border" />
                )}

                <div className="bg-bg border border-border rounded-[16px] p-6 text-center relative hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                  {/* Watermark number */}
                  <div className="absolute top-4 right-4 font-display text-[4rem] leading-none opacity-[0.04] pointer-events-none select-none">
                    {step.num}
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full border ${step.color} flex items-center justify-center mx-auto mb-4`}>
                    {step.icon}
                  </div>

                  <h3 className="mb-2">{step.title}</h3>
                  <p className="text-[0.9375rem] text-text-faint leading-[1.6] m-0">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
