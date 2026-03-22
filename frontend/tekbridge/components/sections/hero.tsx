"use client";

import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { Button } from "../ui/button";
import { Container } from "../ui/container";
import { ScrollReveal } from "../ui/scroll-reveal";

export function Hero() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden pt-[clamp(160px,20vw,220px)] pb-[clamp(48px,8vw,80px)] hero-gradient">
      <Container>
        <div className="flex flex-col items-center text-center relative z-1">
          {/* Badge */}
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center gap-2 bg-bg-alt border border-border px-4 py-1.5 rounded-full text-[0.8125rem] font-semibold text-text-secondary mb-8">
              <span className="relative flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                <span className="absolute w-1.5 h-1.5 rounded-full bg-green animate-pulse-ring" />
              </span>
              {t("hero_badge")}
            </div>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal delay={100}>
            <h1 className="max-w-2xl mx-auto mb-5">
              <span dangerouslySetInnerHTML={{ __html: t("hero_title") }} />
            </h1>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={200}>
            <p className="text-[clamp(1.1rem,1.8vw,1.3rem)] text-text-faint max-w-[560px] leading-[1.65] mb-8">
              {t("hero_desc")}
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal delay={300}>
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              <Button size="lg" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                {t("hero_cta2")}
              </Button>
              <Button variant="ghost" size="lg" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
                {t("hero_cta1")}
              </Button>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[0.8125rem] font-medium">
              {[
                t("hero_stat_pickup"),
                t("hero_stat_captured"),
                t("hero_stat_missed"),
              ].map((stat) => (
                <span key={stat} className="bg-bg-alt border border-border rounded-full px-4 py-1.5 text-text-secondary">
                  {stat}
                </span>
              ))}
            </div>
          </ScrollReveal>

          {/* Phone Mockup */}
          <ScrollReveal delay={200}>
            <div className="mt-16 flex justify-center">
              <PhoneMockup />
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function PhoneMockup() {
  const t = useTranslations();

  return (
    <div className="relative max-w-[340px] w-full">
      {/* Blue glow */}
      <div className="absolute inset-0 -top-12 -bottom-12 bg-accent-brand/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative animate-float">
        <div className="bg-bg-alt border border-border rounded-[20px] p-3 shadow-lg">
          <div className="w-24 h-[22px] bg-bg rounded-b-[12px] mx-auto mb-3" />
          <div className="bg-bg rounded-[14px] p-5 min-h-[320px]">
            {/* Status */}
            <div className="text-[0.6875rem] font-semibold text-green uppercase tracking-[0.08em] text-center flex items-center justify-center gap-1.5">
              <span className="relative flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                <span className="absolute w-1.5 h-1.5 rounded-full bg-green animate-pulse-ring" />
              </span>
              {t("phone_status")}
            </div>
            <div className="text-[0.9375rem] font-bold text-center mt-1">+421 9xx xxx xxx</div>

            {/* Wave */}
            <div className="flex items-center justify-center gap-[3px] h-5 my-3">
              {[6, 14, 8, 18, 10, 16, 6].map((h, i) => (
                <span
                  key={i}
                  className="block w-[3px] rounded-[3px] bg-accent-brand animate-wave"
                  style={{ height: h, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>

            {/* Chat */}
            <div className="flex flex-col gap-2 mt-3">
              <ChatMsg text={t("chat_1")} type="ai" delay={0.8} />
              <ChatMsg text={t("chat_2")} type="user" delay={2} />
              <ChatMsg text={t("chat_3")} type="ai" delay={3.2} />
              <ChatMsg text={t("chat_4")} type="user" delay={4.4} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatMsg({ text, type, delay }: { text: string; type: "ai" | "user"; delay: number }) {
  return (
    <div
      className={clsx(
        "py-2.5 px-3.5 rounded-[14px] text-[0.8125rem] leading-[1.45] max-w-[82%] animate-msg-in",
        type === "ai" && "bg-bg-alt border border-border self-start rounded-bl-[4px]",
        type === "user" && "bg-accent-brand-soft text-accent-brand self-end rounded-br-[4px] font-medium"
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {text}
    </div>
  );
}
