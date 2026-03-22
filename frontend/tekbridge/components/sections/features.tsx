"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../ui/container";

export function Features() {
  const t = useTranslations();

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/>
          <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round"/>
          <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/>
        </svg>
      ),
      title: t("features_booking_title"),
      description: t("features_booking_desc"),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <path d="M8.5 19H5.25a2.25 2.25 0 01-2.25-2.25v-9.5A2.25 2.25 0 015.25 5h13.5A2.25 2.25 0 0121 7.25v9.5A2.25 2.25 0 0118.75 19H15.5m-7 0l3.75 3.75M8.5 19l3.75-3.75M12 5v5.5m0 0l3-3m-3 3l-3-3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: t("features_knowledge_title"),
      description: t("features_knowledge_desc"),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: t("features_availability_title"),
      description: t("features_availability_desc"),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: t("features_latency_title"),
      description: t("features_latency_desc"),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="2" y1="12" x2="22" y2="12" strokeLinecap="round"/>
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: t("features_multilingual_title"),
      description: t("features_multilingual_desc"),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 7v6m-3-3h6" strokeLinecap="round"/>
        </svg>
      ),
      title: t("features_analytics_title"),
      description: t("features_analytics_desc"),
    },
  ];

  return (
    <section id="features" className="py-24 md:py-32 lg:py-40">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">{t("features_title")}</h2>
          <p className="text-lg text-text-faint max-w-2xl mx-auto">
            {t("features_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, boxShadow: "0 8px 30px -6px rgba(0,0,0,0.1)" }}
              className="bg-bg border border-border rounded-2xl p-6 md:p-8 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-brand-soft text-accent-brand flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-faint leading-relaxed m-0">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
