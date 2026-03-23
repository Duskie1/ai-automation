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
            {t.rich("hero_title", {
              br: () => <br />,
              em: (chunks) => <em>{chunks}</em>,
            })}
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
              { key: "pickup", label: t("hero_stat_pickup") },
              { key: "captured", label: t("hero_stat_captured") },
              { key: "missed", label: t("hero_stat_missed") },
            ].map((stat, i) => (
              <motion.span
                key={stat.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                className="bg-bg-alt border border-border rounded-full px-4 py-1.5 text-text-secondary"
              >
                {stat.label}
              </motion.span>
            ))}
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
