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
    <section id="problem" className="bg-bg-alt py-24 md:py-32 lg:py-40">
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
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-bg border border-border rounded-2xl p-8 text-center hover-lift"
            >
              <div className="font-display text-5xl md:text-6xl text-red leading-none mb-3">
                {stat.value === 0 ? (
                  <span>{stat.value}{stat.suffix}</span>
                ) : (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2000} />
                )}
              </div>
              <p className="text-sm md:text-base text-text-faint m-0 leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
