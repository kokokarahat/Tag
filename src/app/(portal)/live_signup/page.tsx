import type { Metadata } from "next";
import { SignupPage } from "@/components/sites/tagmarkets/portal/SignupPage";
import { VisitTracker } from "@/components/sites/tagmarkets/VisitTracker";

export const metadata: Metadata = {
  title: "Register | Tag Markets",
  description: "Open a Tag Markets trading account.",
};

export default function LiveSignup() {
  return (
    <>
      <VisitTracker page="signup" />
      <SignupPage />
    </>
  );
}
