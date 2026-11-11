import type { Metadata } from "next";
import { LoginPage } from "@/components/sites/tagmarkets/portal/LoginPage";
import { VisitTracker } from "@/components/sites/tagmarkets/VisitTracker";

export const metadata: Metadata = {
  title: "Tag Markets",
  description: "Log in to your Tag Markets trading account.",
};

export default function Login() {
  return (
    <>
      <VisitTracker page="login" />
      <LoginPage />
    </>
  );
}
