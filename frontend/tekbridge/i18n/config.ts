export const locales = ["sk", "en"] as const;
export const defaultLocale = "sk" as const;
export type Locale = (typeof locales)[number];
