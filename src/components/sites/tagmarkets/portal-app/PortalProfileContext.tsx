"use client";

import { createContext, useContext } from "react";

export type PortalProfile = {
  name: string;
  email: string;
  customerId: string;
};

export const PortalProfileContext = createContext<PortalProfile>({
  name: "",
  email: "",
  customerId: "",
});

export function PortalProfileProvider({
  name,
  email,
  customerId,
  children,
}: PortalProfile & { children: React.ReactNode }) {
  return (
    <PortalProfileContext.Provider value={{ name, email, customerId }}>
      {children}
    </PortalProfileContext.Provider>
  );
}

export function usePortalProfile() {
  return useContext(PortalProfileContext);
}
