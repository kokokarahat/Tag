import type { Metadata } from "next";
import { SignupPage } from "@/components/sites/tagmarkets/portal/SignupPage";

export const metadata: Metadata = {
  title: "Register | Tag Markets",
  description: "Open a Tag Markets trading account.",
};

export default function LiveSignup() {
  return <SignupPage />;
}
