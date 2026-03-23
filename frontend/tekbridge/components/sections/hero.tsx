"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Container } from "../ui/container";
import { Phone } from "lucide-react";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── HERO CALL WIDGET (enlarged product mockup) ─────────────────────
function HeroCallWidget({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease }}
      className="relative"
    >
      {/* Glow behind card */}
      <div className="absolute inset-0 bg-accent-brand/20 rounded-3xl blur-3xl scale-115" />

      <div className="relative bg-white rounded-2xl shadow-lg border border-border p-6 w-72 md:w-80">
        {/* Live indicator */}
        <motion.div
          className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-green"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="text-[0.65rem] font-semibold text-text-faint uppercase tracking-widest mb-4">
          {t("wf1_visual_status")}
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-accent-brand-soft flex items-center justify-center text-accent-brand shrink-0">
            <Phone size={24} strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-base font-bold text-text-primary leading-tight">{t("wf1_caller")}</div>
            <div className="text-sm text-text-faint">{t("wf1_caller_phone")}</div>
          </div>
        </div>

        <div className="flex gap-2.5">
          <div className="flex-1 bg-red-soft text-red rounded-xl py-3 text-sm font-semibold text-center">
            {t("wf1_decline")}
          </div>
          <motion.div
            className="flex-1 bg-green-soft text-green rounded-xl py-3 text-sm font-semibold text-center"
            animate={{ boxShadow: ["0 0 0 0 rgba(22,163,74,0)", "0 0 0 5px rgba(22,163,74,0.12)", "0 0 0 0 rgba(22,163,74,0)"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {t("wf1_answer")}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── HERO SECTION ───────────────────────────────────────────────────
export function Hero() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden pt-[clamp(140px,18vw,200px)] pb-[clamp(48px,8vw,80px)] hero-gradient">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-1">

          {/* Left column — text */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
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
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="max-w-xl mb-5"
            >
              {t.rich("hero_title", {
                br: () => <br />,
                em: (chunks) => <em>{chunks}</em>,
              })}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="text-[clamp(1.05rem,1.6vw,1.2rem)] text-text-faint max-w-[480px] leading-[1.6] mb-8"
            >
              {t("hero_desc")}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-3 text-[0.8125rem] font-medium justify-center lg:justify-start"
            >
              {[
                { key: "pickup", label: t("hero_stat_pickup") },
                { key: "captured", label: t("hero_stat_captured") },
                { key: "missed", label: t("hero_stat_missed") },
              ].map((stat) => (
                <span
                  key={stat.key}
                  className="bg-bg-alt border border-border rounded-full px-4 py-1.5 text-text-secondary"
                >
                  {stat.label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right column — product mockup */}
          <div className="flex-shrink-0 hidden md:flex items-center justify-center">
            <HeroCallWidget t={t} />
          </div>

        </div>
      </Container>
    </section>
  );
}
