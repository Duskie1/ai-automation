import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: ["400"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isSk = locale === "sk";

  return {
    title: isSk
      ? "TekBridge | AI Recepčná pre Váš Biznis"
      : "TekBridge | AI Receptionist for Your Business",
    description: isSk
      ? "TekBridge — Premieňame zmeškané hovory na tržby. AI recepčná, ktorá zdvihne každý hovor a objedná zákazníka."
      : "TekBridge — Turn missed calls into revenue. AI receptionist that answers every call and books customers.",
    openGraph: {
      title: isSk
        ? "TekBridge | AI Recepčná pre Váš Biznis"
        : "TekBridge | AI Receptionist for Your Business",
      description: isSk
        ? "Premieňame zmeškané hovory na tržby."
        : "Turn missed calls into revenue.",
      url: `https://tekbridge.sk/${locale}`,
      siteName: "TekBridge",
      locale: isSk ? "sk_SK" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: `https://tekbridge.sk/${locale}`,
      languages: {
        sk: "https://tekbridge.sk/sk",
        en: "https://tekbridge.sk/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${jakarta.variable} ${dmSerif.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
