import type { NextConfig } from "next";

/* Заголовки безопасности — те же, что на rslks.com и they.camillebuzuno.com.
   Content-Security-Policy здесь намеренно не задан: Next.js и скрипт выбора
   темы в layout.tsx используют встроенные скрипты, и строгий CSP их сломает. */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), usb=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  /* Старый адрес на vercel.app навсегда ведёт на основной домен,
     чтобы Google не считал их двумя разными сайтами. */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "camille-buzuno-portfolio.vercel.app" }],
        destination: "https://www.camillebuzuno.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
