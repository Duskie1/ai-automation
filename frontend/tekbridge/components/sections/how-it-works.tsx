"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../ui/container";
import { useEffect, useState, memo } from "react";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── CALL NOTIFICATION (Product-like incoming call UI) ──────────────
function CallNotification({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="flex items-center justify-center h-52 mb-4">
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-border p-5 w-60 relative"
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
      >
        {/* Live indicator */}
        <motion.div
          className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-green"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="text-[0.6rem] font-semibold text-text-faint uppercase tracking-widest mb-3">
          {t("wf1_visual_status")}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent-brand-soft flex items-center justify-center text-accent-brand shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-text-primary leading-tight">{t("wf1_caller")}</div>
            <div className="text-xs text-text-faint">{t("wf1_caller_phone")}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 bg-red-soft text-red rounded-xl py-2.5 text-xs font-semibold text-center">
            {t("wf1_decline")}
          </div>
          <motion.div
            className="flex-1 bg-green-soft text-green rounded-xl py-2.5 text-xs font-semibold text-center"
            animate={{ boxShadow: ["0 0 0 0 rgba(22,163,74,0)", "0 0 0 4px rgba(22,163,74,0.12)", "0 0 0 0 rgba(22,163,74,0)"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {t("wf1_answer")}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── CONVERSATION UI (Product-like chat transcript) ─────────────────
function ConversationUI({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="flex items-center justify-center h-52 mb-4">
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-border p-4 w-64"
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
      >
        {/* Chat header */}
        <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-border-light">
          <div className="w-6 h-6 rounded-full bg-accent-brand-soft flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-accent-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
            </svg>
          </div>
          <span className="text-xs font-bold text-text-primary">TekBridge AI</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green" />
        </div>

        {/* Messages — staggered entrance, no loop */}
        <div className="space-y-2 min-h-[96px]">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3, ease }}
            className="bg-accent-brand-soft text-text-primary rounded-xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed max-w-[88%]"
          >
            {t("wf2_msg_ai1")}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.9, ease }}
            className="bg-bg-alt text-text-primary rounded-xl rounded-tr-sm px-3 py-2 text-xs leading-relaxed max-w-[75%] ml-auto"
          >
            {t("wf2_msg_caller")}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 1.5, ease }}
            className="bg-accent-brand-soft text-text-primary rounded-xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed max-w-[88%]"
          >
            {t("wf2_msg_ai2")}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── BOOKING CALENDAR (Polished product-like calendar) ──────────────
const BookingCalendar = memo(function BookingCalendar({ locale }: { locale: string }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const targetDay = Math.min(20, daysInMonth);

  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(now);
  const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  const mondayRef = new Date(now);
  mondayRef.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const dayNames = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(mondayRef);
    date.setDate(mondayRef.getDate() + i);
    return new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(date);
  });

  return (
    <div className="flex items-center justify-center h-52 mb-4">
      <motion.div
        className="bg-white rounded-2xl shadow-lg border border-border p-4 w-64"
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-text-primary">{capitalizedMonth}</span>
          <div className="flex gap-1">
            <div className="w-5 h-5 rounded bg-bg-alt flex items-center justify-center">
              <svg className="w-3 h-3 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </div>
            <div className="w-5 h-5 rounded bg-bg-alt flex items-center justify-center">
              <svg className="w-3 h-3 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {dayNames.map((day, i) => (
            <div key={i} className="text-[0.55rem] text-text-faint text-center font-semibold uppercase">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 relative">
          {days.map((day, i) => {
            const isTarget = day === targetDay;
            const showBooking = isTarget && phase >= 2;

            return (
              <div
                key={i}
                className={`
                  aspect-square flex items-center justify-center text-[0.65rem] rounded-md relative font-medium
                  ${day === null ? "invisible" : "text-text-secondary"}
                  ${isTarget ? "bg-accent-brand text-white font-bold" : ""}
                `}
              >
                {day}
                {isTarget && phase >= 1 && !showBooking && (
                  <motion.div
                    className="absolute inset-0 rounded-md border-2 border-accent-brand"
                    animate={{ scale: [1, 1.15, 1], opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
                {showBooking && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-accent-brand text-white text-[0.55rem] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 whitespace-nowrap z-10 font-semibold"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <svg className="w-1.5 h-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    09:00
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
});

// ─── MAIN COMPONENT ────────────────────────────────────────────────
export function HowItWorks() {
  const t = useTranslations();
  const locale = useLocale();

  const steps = [
    {
      num: "01",
      title: t("wf1_title"),
      desc: t("wf1_desc"),
      visual: <CallNotification t={t} />,
    },
    {
      num: "02",
      title: t("wf2_title"),
      desc: t("wf2_desc"),
      visual: <ConversationUI t={t} />,
    },
    {
      num: "03",
      title: t("wf3_title"),
      desc: t("wf3_desc"),
      visual: <BookingCalendar locale={locale} />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 lg:py-36 bg-bg-alt">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease }}
        >
          <h2 className="text-center mb-4">{t("how_title")}</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="text-center text-text-faint max-w-[520px] mx-auto mb-14 leading-relaxed"
        >
          {t("how_desc")}
        </motion.p>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-5 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.num} className="flex-1 relative">
              {/* Connector arrow */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.2, ease }}
                  className="hidden lg:flex absolute top-1/2 -right-2.5 w-5 items-center justify-center z-10 origin-left"
                >
                  <motion.div
                    animate={{ x: [0, 4, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-accent-brand"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease }}
                className="bg-bg border border-border rounded-2xl p-6 md:p-8 text-center relative h-full overflow-hidden hover-lift"
              >
                {/* Step number */}
                <div className="font-display text-6xl md:text-7xl text-accent-brand/[0.06] absolute top-4 right-5 select-none font-normal">
                  {step.num}
                </div>

                {step.visual}

                <h3 className="text-lg text-text-primary mb-2 relative z-10">
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
