"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Container } from "../ui/container";

export function Hero() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden pt-[clamp(160px,20vw,220px)] pb-[clamp(48px,8vw,80px)] hero-gradient">
      <Container>
        <div className="flex flex-col items-center text-center relative z-1">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-bg-alt border border-border px-4 py-1.5 rounded-full text-[0.8125rem] font-semibold text-text-secondary mb-8">
              <span className="relative flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                <span className="absolute w-1.5 h-1.5 rounded-full bg-green animate-pulse-ring" />
              </span>
              {t("hero_badge")}
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto mb-5"
          >
            <span dangerouslySetInnerHTML={{ __html: t("hero_title") }} />
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(1.1rem,1.8vw,1.3rem)] text-text-faint max-w-[560px] leading-[1.65] mb-8"
          >
            {t("hero_desc")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 mb-8 justify-center"
          >
            <Button size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
              {t("hero_cta2")}
            </Button>
            <Button variant="ghost" size="lg" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
              {t("hero_cta1")}
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-3 text-[0.8125rem] font-medium"
          >
            {[
              t("hero_stat_pickup"),
              t("hero_stat_captured"),
              t("hero_stat_missed"),
            ].map((stat, i) => (
              <motion.span
                key={stat}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="bg-bg-alt border border-border rounded-full px-4 py-1.5 text-text-secondary"
              >
                {stat}
              </motion.span>
            ))}
          </motion.div>

          {/* Workflow Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 md:mt-20"
          >
            <WorkflowVisual />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function WorkflowVisual() {
  const steps = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "Zákazník volá",
      sublabel: "Na vaše číslo",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="8" r="2" fill="currentColor" className="text-accent-brand"/>
        </svg>
      ),
      label: "AI odpovedá",
      sublabel: "Okamžite, 24/7",
      highlight: true,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/>
          <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round"/>
          <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/>
          <path d="M9 16l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: "Termín objednaný",
      sublabel: "Priamo do kalendára",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
            className={`
              relative flex flex-col items-center p-6 rounded-2xl border
              ${step.highlight
                ? "bg-accent-brand-soft border-accent-brand/20"
                : "bg-white border-border"
              }
              shadow-lg hover:shadow-xl transition-shadow duration-300
            `}
          >
            {step.highlight && (
              <div className="absolute inset-0 rounded-2xl bg-accent-brand/5 animate-glow" />
            )}
            <div className={`
              relative z-10 mb-3
              ${step.highlight ? "text-accent-brand" : "text-text-secondary"}
            `}>
              {step.icon}
            </div>
            <div className="relative z-10 text-center">
              <div className="font-semibold text-text-primary">{step.label}</div>
              <div className="text-sm text-text-faint">{step.sublabel}</div>
            </div>
          </motion.div>

          {/* Arrow connector */}
          {i < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 1 + i * 0.2 }}
              className="hidden md:block text-accent-brand/40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          )}

          {/* Mobile arrow */}
          {i < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1 + i * 0.2 }}
              className="md:hidden text-accent-brand/40 rotate-90"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
