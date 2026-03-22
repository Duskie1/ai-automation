"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../ui/container";
import { useEffect, useState } from "react";

// ─── ANIMATED PHONE VISUAL ─────────────────────────────────────────────
function AnimatedPhone() {
  return (
    <div className="relative flex items-center justify-center h-40 mb-6">
      {/* Ring pulse waves */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 rounded-full border-2 border-accent-brand/30"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Phone container */}
      <motion.div
        className="relative z-10 w-20 h-20 rounded-2xl bg-accent-brand-soft flex items-center justify-center"
        animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-accent-brand" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
      </motion.div>

      {/* Incoming call text */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <span className="text-xs font-medium text-text-faint">Incoming call...</span>
      </motion.div>
    </div>
  );
}

// ─── SOUND WAVE VISUAL ─────────────────────────────────────────────────
function SoundWaveVisual() {
  const barDelays = [0, 0.1, 0.2, 0.15, 0.05, 0.25, 0.12];

  return (
    <div className="relative flex flex-col items-center justify-center h-40 mb-6">
      {/* AI glow background */}
      <motion.div
        className="absolute w-24 h-24 rounded-full bg-accent-brand/10 blur-xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sound wave bars */}
      <div className="relative z-10 flex items-end gap-1 h-16 mb-4">
        {barDelays.map((delay, i) => (
          <motion.div
            key={i}
            className="w-2 bg-accent-brand rounded-full"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay,
              ease: "easeInOut"
            }}
            style={{ height: 40, transformOrigin: "bottom" }}
          />
        ))}
      </div>

      {/* AI icon */}
      <motion.div
        className="relative z-10 w-12 h-12 rounded-xl bg-accent-brand-soft flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-accent-brand" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      </motion.div>

      {/* Typing text */}
      <motion.div
        className="absolute bottom-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-xs text-text-faint">
          "Dobrý deň..."
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            |
          </motion.span>
        </span>
      </motion.div>
    </div>
  );
}

// ─── ANIMATED CALENDAR VISUAL ──────────────────────────────────────────
function AnimatedCalendar() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const days = [
    null, null, null, null, null, 1, 2,
    3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16,
    17, 18, 19, 20, 21, 22, 23,
    24, 25, 26, 27, 28, 29, 30
  ];

  const targetDay = 20;

  return (
    <div className="relative h-56 mb-6 flex items-center justify-center">
      <motion.div
        className="bg-white rounded-2xl p-4 shadow-lg border border-border w-64"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Calendar header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-text-primary">Marec 2026</span>
          <div className="flex gap-1">
            <div className="w-5 h-5 rounded bg-bg-alt flex items-center justify-center">
              <svg className="w-3 h-3 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="w-5 h-5 rounded bg-bg-alt flex items-center justify-center">
              <svg className="w-3 h-3 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Po", "Ut", "St", "Št", "Pi", "So", "Ne"].map((day) => (
            <div key={day} className="text-[0.625rem] text-text-faint text-center font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 relative">
          {days.map((day, i) => {
            const isTarget = day === targetDay;
            const showBooking = isTarget && phase >= 2;

            return (
              <div
                key={i}
                className={`
                  aspect-square flex items-center justify-center text-xs rounded-md relative
                  ${day === null ? "invisible" : ""}
                  ${isTarget ? "bg-accent-brand-soft" : ""}
                `}
              >
                {day}
                {/* Target day pulse */}
                {isTarget && phase >= 1 && (
                  <motion.div
                    className="absolute inset-0 rounded-md border-2 border-accent-brand"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {/* Booking chip */}
                {showBooking && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-accent-brand text-white text-[0.5rem] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 whitespace-nowrap z-10"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <motion.svg
                      className="w-2 h-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                    <span>09:00</span>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────
export function HowItWorks() {
  const t = useTranslations();

  const steps = [
    {
      num: "01",
      title: t("wf1_title"),
      desc: t("wf1_desc"),
      visual: <AnimatedPhone />,
    },
    {
      num: "02",
      title: t("wf2_title"),
      desc: t("wf2_desc"),
      visual: <SoundWaveVisual />,
    },
    {
      num: "03",
      title: t("wf3_title"),
      desc: t("wf3_desc"),
      visual: <AnimatedCalendar />,
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

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.num} className="flex-1 relative">
              {/* Animated connector arrow */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden lg:flex absolute top-1/2 -right-3 left-auto w-6 items-center justify-center z-10 origin-left"
                >
                  <motion.div
                    animate={{ x: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-accent-brand"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
                className="bg-bg border border-border rounded-3xl p-8 md:p-10 text-center relative transition-all duration-500 h-full overflow-hidden"
              >
                {/* Step number */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
                  className="font-display text-7xl md:text-8xl text-accent-brand/[0.07] absolute top-6 right-6 select-none"
                >
                  {step.num}
                </motion.div>

                {/* Visual */}
                {step.visual}

                {/* Text content */}
                <h3 className="text-xl font-semibold text-text-primary mb-3 relative z-10">
                  {step.title}
                </h3>
                <p className="text-sm text-text-faint leading-relaxed m-0 relative z-10">
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
