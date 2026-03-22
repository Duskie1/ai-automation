import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // output: "export", // Disabled for dev - re-enable for static production builds
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
