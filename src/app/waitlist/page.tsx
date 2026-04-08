import type { Metadata } from "next";
import EmailForm from "../../components/waitlist/EmailForm";

export const metadata: Metadata = {
  title: "SipNote — 加入等待名單",
  description:
    "每一杯，都讓你更了解自己。SipNote 是你的個人調酒筆記本，記錄風味、探索口味圖譜、獲得個人化推薦。",
  openGraph: {
    title: "SipNote — 加入等待名單",
    description:
      "每一杯，都讓你更了解自己。SipNote 是你的個人調酒筆記本，記錄風味、探索口味圖譜、獲得個人化推薦。",
    url: "https://cocktail-app-zeta-puce.vercel.app/waitlist",
    siteName: "SipNote",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "/icons/icon.svg",
        width: 512,
        height: 512,
        alt: "SipNote Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SipNote — 加入等待名單",
    description:
      "每一杯，都讓你更了解自己。SipNote 是你的個人調酒筆記本，記錄風味、探索口味圖譜、獲得個人化推薦。",
  },
  keywords: [
    "調酒",
    "雞尾酒",
    "酒吧",
    "口味",
    "記錄",
    "推薦",
    "cocktail",
    "bar",
    "SipNote",
    "等待名單",
  ],
};

/* ── Inline SVG icons for server component ── */

function CocktailLogo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2l8 0" />
      <path d="M5 6l14 0" />
      <path d="M6 6l1.5 9.5a2 2 0 002 1.5h5a2 2 0 002-1.5L18 6" />
      <path d="M12 17v4" />
      <path d="M9 21h6" />
    </svg>
  );
}

function FeatureBookIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      <path d="M9 7h6" />
      <path d="M9 11h4" />
    </svg>
  );
}

function FeatureRadarIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 2 14.5 9 22 9.5 16 14 18 21.5 12 17 6 21.5 8 14 2 9.5 9.5 9 12 2" />
    </svg>
  );
}

function FeatureSparkleIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function FeatureShareIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/* ── Feature card data ── */

const features = [
  {
    icon: <FeatureBookIcon />,
    title: "記錄調酒",
    description: "記下每一杯的風味、酒譜、場景與心得，打造專屬於你的調酒日誌。",
  },
  {
    icon: <FeatureRadarIcon />,
    title: "口味圖譜",
    description: "透過雷達圖視覺化你的風味偏好，發現自己獨特的味覺輪廓。",
  },
  {
    icon: <FeatureSparkleIcon />,
    title: "個人化推薦",
    description: "根據你的口味歷史與偏好，智慧推薦下一杯你會喜歡的調酒。",
  },
  {
    icon: <FeatureShareIcon />,
    title: "分享卡片",
    description: "一鍵生成精美的調酒卡片，與朋友分享你的品飲紀錄。",
  },
];

/* ── Page ── */

export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex flex-col animated-gradient">
      {/* Hero */}
      <section className="flex flex-col items-center pt-16 pb-10 px-6 page-enter">
        {/* Logo */}
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-bg-card/80 border border-border mb-6">
          <CocktailLogo />
        </div>

        {/* Brand name */}
        <h1 className="text-2xl font-bold tracking-wide text-text-primary mb-2">
          SipNote
        </h1>

        {/* Tagline */}
        <p className="text-accent text-base font-medium mb-4">
          每一杯，都讓你更了解自己
        </p>

        {/* Subtitle */}
        <p className="text-text-secondary text-sm text-center leading-relaxed max-w-xs">
          SipNote 是你的個人調酒筆記本。記錄每一杯的故事與風味，
          探索口味圖譜，讓每次品飲都成為一段值得回味的體驗。
        </p>
      </section>

      {/* Divider */}
      <div className="mx-6 h-px bg-border" />

      {/* Features */}
      <section className="px-6 py-10">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-6 text-center">
          功能亮點
        </h2>
        <div className="flex flex-col gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-4 rounded-xl bg-bg-card/60 border border-border/60"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-lg bg-accent/10">
                {feature.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="mx-6 h-px bg-border" />

      {/* Email signup */}
      <section className="px-6 py-10">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-widest mb-2 text-center">
          搶先體驗
        </h2>
        <p className="text-text-secondary text-xs text-center mb-6">
          留下你的 Email，我們會在上線時第一時間通知你
        </p>
        <EmailForm />
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center">
        <p className="text-xs text-text-muted">
          SipNote &mdash; Coming Soon
        </p>
      </footer>
    </div>
  );
}
