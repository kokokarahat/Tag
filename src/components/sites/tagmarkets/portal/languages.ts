export type PortalLanguage = {
  code: string;
  label: string;
};

/** Language switcher entries, in the order the portal renders them. */
export const portalLanguages: PortalLanguage[] = [
  { code: "en", label: "ENGLISH" },
  { code: "th", label: "THAI" },
  { code: "ms", label: "MALAY" },
  { code: "ja", label: "JAPANESE" },
  { code: "hi", label: "HINDI" },
  { code: "ru", label: "RUSSIAN" },
  { code: "es", label: "SPANISH" },
  { code: "de", label: "GERMAN" },
  { code: "it", label: "ITALIAN" },
  { code: "ar", label: "ARABIC" },
  { code: "fr", label: "FRENCH" },
  { code: "pt", label: "PORTUGUESE" },
  { code: "cn", label: "CHINESE (SIMPLIFIED)" },
  { code: "ko", label: "KOREAN" },
  { code: "ind", label: "INDONESIAN" },
];

export const flagSrc = (code: string) => `/sites/tagmarkets/portal/flags/${code}.svg`;
