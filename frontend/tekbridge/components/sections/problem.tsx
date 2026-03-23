"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../ui/container";
import { AnimatedCounter } from "../ui/animated-counter";

export function Problem() {
  const t = useTranslations();

  const stats = [
    { value: 67, suffix: "%", label: t("problem_stat_1") },
    { value: 85, suffix: "%", label: t("problem_stat_2") },
    { value: 0, suffix: "", label: t("problem_stat_3") },
  ];

  return (
    <section id="problem" className="bg-bg-alt py-20 md:py-28 lg:py-36 relative">
      {/* Gradient transition to dark features below */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-hero-dark pointer-events-none" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-center max-w-2xl mx-auto mb-4">
            {t.rich("problem_title", {
              br: () => <br />,
            })}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-lg text-text-faint max-w-[560px] mx-auto mb-16 leading-relaxed"
        >
          {t("problem_desc")}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="bg-bg border border-border rounded-2xl p-8 text-center shadow-sm hover-lift"
            >
              <div className="font-display text-5xl md:text-6xl text-red leading-none mb-3">
                {stat.value === 0 ? (
                  <span>0<span className="text-3xl md:text-4xl">%</span></span>
                ) : (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2000} />
                )}
              </div>
              <p className="text-sm md:text-base text-text-faint m-0 leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
