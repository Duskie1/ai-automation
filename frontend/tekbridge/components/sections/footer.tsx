"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { clsx } from "clsx";
import { Container } from "../ui/container";
import { locales } from "@/i18n/config";

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <footer className="border-t border-white/6 py-8 bg-hero-dark">
      <Container>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="text-[0.8125rem] text-white/40">
            <strong className="text-white/60">TekBridge</strong> · AI &amp; Automation Solutions · © {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-[0.75rem] font-semibold text-green bg-green/10 border border-green/20 px-2.5 py-1 rounded-[6px]">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-green stroke-2 fill-none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              GDPR
            </div>
            <div className="flex gap-1.5">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => switchLocale(loc)}
                  className={clsx(
                    "text-[0.8125rem] font-semibold px-2.5 py-1 rounded-[6px] border transition-all duration-200 cursor-pointer bg-transparent",
                    locale === loc
                      ? "text-white border-white/20 bg-white/10"
                      : "text-white/40 border-transparent hover:text-white/60"
                  )}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
