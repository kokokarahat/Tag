"use client";

import { useRouter } from "next/navigation";

import { PortalFooter } from "./PortalFooter";
import { PortalNav } from "./PortalNav";

export function DashboardView({ email }: { email: string }) {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <>
      <div className="bg-theme-full-container">
        <div className="container">
          <PortalNav
            langBase="/dashboard"
            account={{ email, onSignOut: () => void signOut() }}
          />
          <div className="row margin-bottom-50">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="syntellicore-login">
                <div className="login-container">
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="portlet padding-30">
                        <h2>Welcome back</h2>
                        <hr />
                        <p className="margin-bottom-20">
                          You are signed in as <strong>{email}</strong>.
                        </p>
                        <p className="text-muted margin-bottom-20">
                          Your account area is ready. Trading tools are coming online shortly.
                        </p>
                        <p className="text-muted margin-bottom-0">
                          Use <strong>Sign out</strong> in the top navigation to end this session.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PortalFooter />
    </>
  );
}
