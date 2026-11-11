export type Locale = {
  code: string;
  flag: string;
  label: string;
  href: string;
  current?: boolean;
};

export const locales: Locale[] = [
  { code: "en", flag: "gb", label: "English", href: "/", current: true },
  { code: "es", flag: "es", label: "Español", href: "https://www.tagmarkets.com/es/" },
  { code: "de", flag: "de", label: "Deutsch", href: "https://www.tagmarkets.com/de/" },
  { code: "it", flag: "it", label: "Italiano", href: "https://www.tagmarkets.com/it/" },
  { code: "ja", flag: "jp", label: "日本語", href: "https://www.tagmarkets.com/ja/" },
  { code: "zh", flag: "cn", label: "中文", href: "https://www.tagmarkets.com/zh/" },
  { code: "ar", flag: "sa", label: "العربية", href: "https://www.tagmarkets.com/ar/" },
  { code: "hi", flag: "in", label: "हिन्दी", href: "https://www.tagmarkets.com/hi/" },
  { code: "zh-Hans", flag: "cn", label: "简体中文", href: "https://www.tagmarkets.com/zh-Hans/" },
  { code: "ko", flag: "kr", label: "한국어", href: "https://www.tagmarkets.com/ko/" },
  { code: "vi", flag: "vn", label: "Tiếng Việt", href: "https://www.tagmarkets.com/vi/" },
  { code: "ru", flag: "ru", label: "Русский", href: "https://www.tagmarkets.com/ru/" },
  { code: "my", flag: "mm", label: "မြန်မာ", href: "https://www.tagmarkets.com/my/" },
  { code: "th", flag: "th", label: "ไทย", href: "https://www.tagmarkets.com/th/" },
  { code: "tr", flag: "tr", label: "Türkçe", href: "https://www.tagmarkets.com/tr/" },
  { code: "fr", flag: "fr", label: "Français", href: "https://www.tagmarkets.com/fr/" },
];

export type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Trading",
    children: [
      { label: "Account Types", href: "/account-types/" },
      { label: "Amplify", href: "/amplify/" },
      { label: "Funding Methods", href: "/deposit-methods/" },
    ],
  },
  { label: "CopyX", href: "/copy-trade/" },
  { label: "IB", href: "/partners/" },
  { label: "Education", href: "/education/" },
  {
    label: "Support",
    children: [
      { label: "Contact Us", href: "/contact/" },
      { label: "Help Center", href: "https://intercom.help/tag-markets/en/" },
    ],
  },
];

export const footerColumns = [
  {
    title: "Legal",
    links: [
      { label: "Risk Warning", href: "/risk-warning/" },
      { label: "Privacy", href: "/privacy/" },
      { label: "Client Agreement", href: "/client-agreement/" },
      { label: "Complaints", href: "/complaints/" },
      { label: "Conflict of interest", href: "/conflict-of-interest/" },
      { label: "KYC-AML", href: "/kyc-aml/" },
      { label: "Refund Policy", href: "/refund-and-withdrawal-policy/" },
    ],
  },
  {
    title: "Help & Support",
    links: [
      { label: "Contact Us", href: "/contact/" },
      { label: "Help Center", href: "https://intercom.help/tag-markets/en/" },
    ],
  },
  {
    title: "About Tag",
    links: [
      { label: "Regulatory request", href: "/regulatory-request/" },
      { label: "Insurance", href: "/insurance/", highlight: true },
    ],
  },
];

/** Get Started and the other sign-up CTAs go to the local sign-up page, not the live portal. */
export const PORTAL_URL = "/live_signup";
export const LOGIN_URL = "/login";
export const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=447557488836";
