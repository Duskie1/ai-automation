"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Container } from "../ui/container";

export function CTA() {
  const t = useTranslations();

  return (
    <section id="contact" className="relative bg-hero-dark text-hero-text py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent-brand/5 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display font-normal text-center mb-4 max-w-2xl mx-auto">
            <span dangerouslySetInnerHTML={{ __html: t("cta_title") }} />
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-hero-muted max-w-[560px] leading-relaxed mx-auto mb-10 text-center"
        >
          {t("cta_desc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Button
              variant="white"
              size="lg"
              href="mailto:dusan@tekbridge.sk"
            >
              dusan@tekbridge.sk →
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center gap-8 flex-wrap"
        >
          <div className="flex items-center gap-2 text-sm text-hero-muted">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-accent-brand stroke-1.5 fill-none">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
            <a href="https://tekbridge.sk" className="text-accent-brand font-semibold hover:underline transition-colors">
              tekbridge.sk
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-hero-muted">
            <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-accent-brand stroke-1.5 fill-none">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {t("location")}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
