"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "../ui/container";
import { Globe, MapPin } from "lucide-react";

export function CTA() {
  const t = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`TekBridge consultation — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:dusan@tekbridge.sk?subject=${subject}&body=${body}`;
  };

  const inputClass =
    "w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-[0.9rem] text-hero-text placeholder:text-white/40 outline-none transition-colors duration-200 focus:border-accent-brand focus:bg-white/[0.08] font-[inherit]";

  return (
    <section id="contact" className="relative bg-hero-dark text-hero-text py-20 md:py-28 lg:py-36 overflow-hidden noise-overlay">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent-brand/15 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display font-normal text-center mb-4 max-w-2xl mx-auto">
            {t.rich("cta_title", {
              br: () => <br />,
            })}
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

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-lg mx-auto space-y-3 mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("cta_name")}
              className={inputClass}
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("cta_email")}
              className={inputClass}
            />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("cta_message")}
            rows={3}
            className={`${inputClass} resize-none`}
          />
          <button
            type="submit"
            className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 font-semibold bg-white text-hero-dark rounded-full hover:bg-white/95 hover:shadow-xl transition-all duration-200 cursor-pointer text-[0.95rem] outline-none focus-visible:ring-2 focus-visible:ring-accent-brand focus-visible:ring-offset-2 focus-visible:ring-offset-hero-dark hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("cta_submit")}
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-8"
        >
          <span className="text-sm text-hero-muted">
            {t("cta_or_email")}{" "}
            <a href="mailto:dusan@tekbridge.sk" className="text-accent-brand font-semibold hover:underline transition-colors">
              dusan@tekbridge.sk
            </a>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center gap-8 flex-wrap"
        >
          <div className="flex items-center gap-2 text-sm text-hero-muted">
            <Globe size={16} strokeWidth={1.75} className="text-accent-brand" />
            <a href="https://tekbridge.sk" className="text-accent-brand font-semibold hover:underline transition-colors">
              tekbridge.sk
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-hero-muted">
            <MapPin size={16} strokeWidth={1.75} className="text-accent-brand" />
            {t("location")}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
