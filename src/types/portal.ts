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
};

export type PortalEvent = LoginEvent | SignupEvent;
