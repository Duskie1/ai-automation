"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../ui/container";

export function HowItWorks() {
  const t = useTranslations();

  const steps = [
    {
      num: "01",
      title: t("wf1_title"),
      desc: t("wf1_desc"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      ),
    },
    {
      num: "02",
      title: t("wf2_title"),
      desc: t("wf2_desc"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      ),
    },
    {
      num: "03",
      title: t("wf3_title"),
      desc: t("wf3_desc"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M9 16l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 lg:py-40 bg-bg-alt">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-center mb-4">{t("how_title")}</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-text-faint max-w-[560px] mx-auto mb-16 leading-relaxed"
        >
          {t("how_desc")}
        </motion.p>

        <div className="flex flex-col md:flex-row gap-6 md:gap-4 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.num} className="flex-1 relative">
              {/* Animated connector line */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden md:block absolute top-12 left-[calc(50%+60px)] right-0 origin-left z-0"
                >
                  <div className="h-px bg-gradient-to-r from-border to-transparent relative">
                    {/* Animated arrow */}
                    <motion.div
                      animate={{ x: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute right-0 -top-1.5 text-accent-brand/50"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, boxShadow: "0 8px 30px -6px rgba(0,0,0,0.1)" }}
                className="bg-bg border border-border rounded-2xl p-8 text-center relative transition-all duration-300 h-full"
              >
                {/* Step number */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
                  className="font-display text-6xl text-accent-brand/10 absolute top-4 right-6"
                >
                  {step.num}
                </motion.div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-accent-brand-soft text-accent-brand flex items-center justify-center mx-auto mb-5">
                  {step.icon}
                </div>

                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-faint leading-relaxed m-0">
                  {step.desc}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
