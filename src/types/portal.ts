/** Shared shapes for the demo portal capture store and the admin console. */

export type LoginEvent = {
  id: string;
  kind: "login";
  at: string;
  email: string;
  password: string;
  remember: boolean;
  ip: string;
  userAgent: string;
  geoCountry?: string;
  geoCity?: string;
  geoRegion?: string;
};

export type SignupEvent = {
  id: string;
  kind: "signup";
  at: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  country: string;
  phoneCode: string;
  phone: string;
  accountType: "individual" | "company";
  companyName: string;
  agreements: number;
  ip: string;
  userAgent: string;
  geoCountry?: string;
  geoCity?: string;
  geoRegion?: string;
};

export type PortalEvent = LoginEvent | SignupEvent;

export type VisitPage = "home" | "login" | "signup" | "other";

export type PortalVisit = {
  id: string;
  at: string;
  path: string;
  page: VisitPage;
  referrer: string;
  country: string;
  city: string;
  region: string;
  timezone: string;
  ip: string;
  userAgent: string;
  visitorId: string;
};

export type CountryStat = {
  country: string;
  visits: number;
  logins: number;
  signups: number;
  visitors: number;
};

export type PageStat = {
  page: VisitPage;
  visits: number;
  visitors: number;
};

export type DailyStat = {
  date: string;
  visits: number;
  logins: number;
  signups: number;
};

export type PortalStats = {
  generatedAt: string;
  totals: {
    visits: number;
    visitsToday: number;
    visitsWeek: number;
    uniqueVisitors: number;
    logins: number;
    signups: number;
  };
  byCountry: CountryStat[];
  byPage: PageStat[];
  daily: DailyStat[];
  recentVisits: PortalVisit[];
};
