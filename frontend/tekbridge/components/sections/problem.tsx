"use client";

import { useTranslations } from "next-intl";
import { Container } from "../ui/container";
import { ScrollReveal } from "../ui/scroll-reveal";

export function Problem() {
  const t = useTranslations();

  const stats = [
    { value: "67%", label: t("problem_stat_1") },
    { value: "20–40%", label: t("problem_stat_2") },
    { value: "0", label: t("problem_stat_3") },
  ];

  return (
    <section id="problem" className="bg-bg-alt py-[clamp(64px,12vw,96px)]">
      <Container>
        <ScrollReveal>
          <h2 className="text-center max-w-2xl mx-auto mb-4">
            <span dangerouslySetInnerHTML={{ __html: t("problem_title") }} />
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p className="text-center text-text-faint max-w-[560px] mx-auto mb-12 leading-[1.65]">
            {t("problem_desc")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[800px] mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-bg border border-border rounded-[16px] p-6 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="font-display text-[2.5rem] text-red leading-none mb-2">
                  {stat.value}
                </div>
                <p className="text-[0.9375rem] text-text-faint m-0">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
