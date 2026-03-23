"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../ui/container";
import { CalendarCheck, BookOpen, Clock, Zap, Globe, BarChart3 } from "lucide-react";

export function Features() {
  const t = useTranslations();

  const features = [
    {
      id: "booking",
      accent: "teal" as const,
      icon: CalendarCheck,
      title: t("features_booking_title"),
      description: t("features_booking_desc"),
    },
    {
      id: "knowledge",
      accent: "teal" as const,
      icon: BookOpen,
      title: t("features_knowledge_title"),
      description: t("features_knowledge_desc"),
    },
    {
      id: "availability",
      accent: "amber" as const,
      icon: Clock,
      title: t("features_availability_title"),
      description: t("features_availability_desc"),
    },
    {
      id: "latency",
      accent: "amber" as const,
      icon: Zap,
      title: t("features_latency_title"),
      description: t("features_latency_desc"),
    },
    {
      id: "multilingual",
      accent: "teal" as const,
      icon: Globe,
      title: t("features_multilingual_title"),
      description: t("features_multilingual_desc"),
    },
    {
      id: "analytics",
      accent: "teal" as const,
      icon: BarChart3,
      title: t("features_analytics_title"),
      description: t("features_analytics_desc"),
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 lg:py-36 bg-hero-dark text-hero-text noise-overlay">
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="md:text-left text-center mb-16"
        >
          <h2 className="mb-4">{t("features_title")}</h2>
          <p className="text-lg text-white/60 max-w-2xl md:mx-0 mx-auto">
            {t("features_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/[0.07] border border-white/[0.10] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:bg-white/[0.10] hover:border-white/[0.15]"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                feature.accent === "amber"
                  ? "bg-amber/15 text-amber"
                  : "bg-accent-brand/15 text-accent-brand"
              }`}>
                <feature.icon size={24} strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-hero-text mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-hero-muted leading-relaxed m-0">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
