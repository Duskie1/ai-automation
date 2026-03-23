"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../ui/container";
import { useEffect, useState, memo } from "react";
import { Phone, Mic, CalendarDays, ChevronLeft, ChevronRight, Check } from "lucide-react";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── CALL NOTIFICATION (Large, detailed, product-like) ──────────────
function CallNotification({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.15, ease }}
      className="w-full max-w-sm mx-auto lg:mx-0"
    >
      <div className="bg-white rounded-xl shadow-md border border-border p-6 relative">
        {/* Live indicator */}
        <motion.div
          className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-green"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="text-[0.7rem] font-semibold text-text-faint uppercase tracking-widest mb-4">
          {t("wf1_visual_status")}
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-accent-brand-soft flex items-center justify-center text-accent-brand shrink-0">
            <Phone size={24} strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="text-base font-bold text-text-primary leading-tight">{t("wf1_caller")}</div>
            <div className="text-sm text-text-faint mt-0.5">{t("wf1_caller_phone")}</div>
          </div>
        </div>

        {/* Call timer */}
        <div className="flex items-center gap-2 mb-5 text-xs text-text-faint">
          <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
          <span className="font-mono">00:03</span>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-red-soft text-red rounded-xl py-3 text-sm font-semibold text-center cursor-default">
            {t("wf1_decline")}
          </div>
          <motion.div
            className="flex-1 bg-green-soft text-green rounded-xl py-3 text-sm font-semibold text-center cursor-default"
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

// ─── CONVERSATION UI (Large chat with 5 messages) ───────────────────
function ConversationUI({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.15, ease }}
      className="w-full max-w-md mx-auto lg:mx-0"
    >
      <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-bg-alt/50">
          <div className="w-8 h-8 rounded-full bg-accent-brand-soft flex items-center justify-center shrink-0">
            <Mic size={16} strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-sm font-bold text-text-primary">TekBridge AI</div>
            <div className="text-xs text-accent-brand font-medium">Online</div>
          </div>
          <span className="ml-auto w-2 h-2 rounded-full bg-green" />
        </div>

        {/* Messages */}
        <div className="p-5 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3, ease }}
          >
            <div className="bg-accent-brand-soft text-text-primary rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed max-w-[85%]">
              {t("wf2_msg_ai1")}
            </div>
            <div className="text-[0.65rem] text-text-faint mt-1 ml-1">09:01</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.8, ease }}
          >
            <div className="bg-bg-alt text-text-primary rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed max-w-[70%] ml-auto">
              {t("wf2_msg_caller")}
            </div>
            <div className="text-[0.65rem] text-text-faint mt-1 text-right mr-1">09:01</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 1.3, ease }}
          >
            <div className="bg-accent-brand-soft text-text-primary rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed max-w-[85%]">
              {t("wf2_msg_ai2")}
            </div>
            <div className="text-[0.65rem] text-text-faint mt-1 ml-1">09:02</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 1.8, ease }}
          >
            <div className="bg-accent-brand-soft text-text-primary rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed max-w-[85%]">
              {t("wf2_msg_ai3")}
            </div>
            <div className="text-[0.65rem] text-text-faint mt-1 ml-1">09:02</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 2.3, ease }}
          >
            <div className="bg-bg-alt text-text-primary rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed max-w-[70%] ml-auto">
              {t("wf2_msg_caller2")}
            </div>
            <div className="text-[0.65rem] text-text-faint mt-1 text-right mr-1">09:02</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── WEEK CALENDAR (Cal.com-inspired, wide, with events) ────────────
const WeekCalendar = memo(function WeekCalendar({ t, locale }: { t: ReturnType<typeof useTranslations>; locale: string }) {
  const [showBooked, setShowBooked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBooked(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Generate 5 weekday labels starting from next Monday
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() + ((8 - now.getDay()) % 7 || 7));

  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dayName = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(d);
    const dayNum = d.getDate();
    return { name: dayName.charAt(0).toUpperCase() + dayName.slice(1), num: dayNum };
  });

  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

  // Events placed by [dayIndex, startHourIndex, span, label, color]
  type EventDef = { day: number; start: number; span: number; label: string; color: string; bg: string };
  const events: EventDef[] = [
    { day: 0, start: 1, span: 1, label: t("wf3_consultation"), color: "text-accent-brand", bg: "bg-accent-brand/10" },
    { day: 1, start: 2, span: 2, label: t("wf3_followup"), color: "text-amber", bg: "bg-amber/10" },
    { day: 2, start: 0, span: 1, label: t("wf3_new_client"), color: "text-accent-brand", bg: "bg-accent-brand/10" },
    { day: 3, start: 1, span: 1, label: `${t("wf1_caller")} ✓`, color: "text-green", bg: "bg-green/10" },
    { day: 4, start: 3, span: 2, label: t("wf3_consultation"), color: "text-red", bg: "bg-red/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.15, ease }}
      className="w-full max-w-lg mx-auto lg:mx-0"
    >
      <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-bg-alt/50">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} strokeWidth={1.75} />
            <span className="text-sm font-bold text-text-primary">TekBridge Calendar</span>
          </div>
          <div className="flex gap-1 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-accent-brand text-white font-semibold">Week</span>
            <span className="px-2.5 py-1 rounded-md text-text-faint font-medium">Month</span>
          </div>
        </div>

        {/* Week grid */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[420px]">
            {/* Day headers */}
            <div className="grid grid-cols-[56px_repeat(5,1fr)] border-b border-border">
              <div />
              {weekDays.map((d, i) => (
                <div key={i} className="text-center py-3 border-l border-border">
                  <div className="text-xs text-text-faint font-medium">{d.name}</div>
                  <div className={`text-sm font-bold mt-0.5 ${i === 3 ? "text-accent-brand" : "text-text-primary"}`}>
                    {d.num}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="relative">
              {hours.map((hour, hi) => (
                <div key={hour} className="grid grid-cols-[56px_repeat(5,1fr)] h-11 border-b border-border-light last:border-b-0">
                  <div className="text-[0.65rem] text-text-faint font-mono pr-3 text-right pt-1 font-medium">{hour}</div>
                  {Array.from({ length: 5 }, (_, di) => (
                    <div key={di} className="border-l border-border-light relative">
                      {/* Events */}
                      {showBooked && events
                        .filter(e => e.day === di && e.start === hi)
                        .map((event, ei) => (
                          <motion.div
                            key={ei}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: event.day * 0.08, ease }}
                            className={`absolute inset-x-1 top-1 rounded-md px-2 py-1 ${event.bg} ${event.color} z-10`}
                            style={{ height: `${event.span * 44 - 8}px` }}
                          >
                            <div className="text-xs font-semibold truncate">{event.label}</div>
                            <div className="text-[0.65rem] font-medium">
                              {hours[event.start]} – {hours[event.start + event.span] || "15:00"}
                            </div>
                          </motion.div>
                        ))
                      }
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          </div>
          {/* Mobile scroll fade */}
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none lg:hidden" />
        </div>
      </div>
    </motion.div>
  );
});

// ─── STEP ROW ───────────────────────────────────────────────────────
function StepRow({
  num,
  title,
  desc,
  bullets,
  visual,
  reverse,
}: {
  num: string;
  title: string;
  desc: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 lg:gap-16`}>
      {/* Text side */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? 20 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex-1 text-center lg:text-left relative"
      >
        {/* Large background step number */}
        <div className="font-display text-[8rem] md:text-[10rem] leading-none text-accent-brand/[0.07] absolute -top-10 -left-4 select-none pointer-events-none hidden lg:block">
          {num}
        </div>

        <span className="inline-block text-sm font-bold text-accent-brand tracking-wider mb-3 font-mono relative">
          STEP {num}
        </span>
        <h3 className="text-2xl md:text-3xl text-text-primary mb-3 relative">
          {title}
        </h3>
        <p className="text-base text-text-faint leading-relaxed max-w-md mx-auto lg:mx-0 mb-5 relative">
          {desc}
        </p>

        {/* Bullet list */}
        <ul className="space-y-2.5 max-w-md mx-auto lg:mx-0 relative">
          {bullets.map((bullet, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.08, ease }}
              className="flex items-center gap-3 text-sm text-text-secondary"
            >
              <Check size={16} strokeWidth={2.5} className="text-accent-brand shrink-0" />
              {bullet}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Visual side — takes more space, last step breaks out */}
      <div className={`flex-1 lg:flex-[1.3] w-full ${num === "03" ? "lg:-mr-12 lg:scale-[1.02]" : ""}`}>
        {visual}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────
export function HowItWorks() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section id="how-it-works" className="py-20 md:py-28 lg:py-36 bg-bg-alt dot-pattern">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease }}
          className="text-center mb-16 md:mb-20 relative z-10"
        >
          <h2 className="mb-4">{t("how_title")}</h2>
          <p className="text-text-faint max-w-[520px] mx-auto leading-relaxed text-lg">
            {t("how_desc")}
          </p>
        </motion.div>

        <div className="space-y-16 md:space-y-24 max-w-5xl mx-auto relative z-10">
          <StepRow
            num="01"
            title={t("wf1_title")}
            desc={t("wf1_desc")}
            bullets={[t("wf1_bullet_1"), t("wf1_bullet_2"), t("wf1_bullet_3")]}
            visual={<CallNotification t={t} />}
          />

          <StepRow
            num="02"
            title={t("wf2_title")}
            desc={t("wf2_desc")}
            bullets={[t("wf2_bullet_1"), t("wf2_bullet_2"), t("wf2_bullet_3")]}
            visual={<ConversationUI t={t} />}
            reverse
          />

          <StepRow
            num="03"
            title={t("wf3_title")}
            desc={t("wf3_desc")}
            bullets={[t("wf3_bullet_1"), t("wf3_bullet_2"), t("wf3_bullet_3")]}
            visual={<WeekCalendar t={t} locale={locale} />}
          />
        </div>
      </Container>
    </section>
  );
}
