"use client";

import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Container } from "../ui/container";
import { ScrollReveal } from "../ui/scroll-reveal";

export function CTA() {
  const t = useTranslations();

  return (
    <section id="contact" className="bg-hero-dark text-hero-text py-[clamp(80px,14vw,120px)]">
      <Container>
        <ScrollReveal>
          <h2 className="font-display font-normal text-center mb-4 max-w-2xl mx-auto">
            <span dangerouslySetInnerHTML={{ __html: t("cta_title") }} />
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <p className="text-[clamp(1.05rem,1.5vw,1.2rem)] text-hero-muted max-w-[560px] leading-[1.65] mx-auto mb-8 text-center">
            {t("cta_desc")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="text-center mb-10">
            <Button
              variant="white"
              size="lg"
              href="mailto:dusan@tekbridge.sk"
            >
              dusan@tekbridge.sk →
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-[0.875rem] text-hero-muted">
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-accent-brand stroke-[1.5] fill-none">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
              <a href="https://tekbridge.sk" className="text-accent-brand font-semibold hover:underline">
                tekbridge.sk
              </a>
            </div>
            <div className="flex items-center gap-2 text-[0.875rem] text-hero-muted">
              <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-accent-brand stroke-[1.5] fill-none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t("location")}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
