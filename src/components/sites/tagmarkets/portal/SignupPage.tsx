"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type HTMLAttributes } from "react";

import { countries } from "./countries";
import { PortalFooter } from "./PortalFooter";
import { PortalNav } from "./PortalNav";

function PasswordInput({
  id,
  name,
  placeholder,
}: {
  id: string;
  name: string;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="right_inner_addon">
      <div className="input-group">
        <input
          className="form-control"
          type={visible ? "text" : "password"}
          name={name}
          id={id}
          required
          placeholder={placeholder}
        />
        <span className="input-group-addon">
          <span
            className={`fa ${visible ? "fa-eye" : "fa-eye-slash"}`}
            id={id === "userPassword" ? "enable-show" : "enable-show-conf"}
            aria-hidden="true"
            onClick={() => setVisible((value) => !value)}
          />
        </span>
      </div>
    </div>
  );
}

export function SignupPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [accountType, setAccountType] = useState<"individual" | "company">("individual");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    const form = formRef.current;
    if (!form || pending) return;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const countryValue = String(data.get("cou_id") ?? "");
    const country = countries.find((item) => item.value === countryValue)?.label ?? "";
    const agreements = form.querySelectorAll<HTMLInputElement>(".agreement:checked").length;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/portal/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: String(data.get("fname") ?? ""),
          lastName: String(data.get("lname") ?? ""),
          email: String(data.get("userEmail") ?? ""),
          password: String(data.get("userPassword") ?? ""),
          country,
          phoneCode: String(data.get("tel_country_code") ?? ""),
          phone: String(data.get("tel") ?? ""),
          accountType,
          companyName: String(data.get("company_name") ?? ""),
          agreements,
        }),
      });
      if (!response.ok) throw new Error("signup failed");
      router.push("/en/home");
    } catch {
      setError("Unable to create the account right now. Please try again.");
      setPending(false);
    }
  }

  return (
    <>
      <div className="bg-theme-full-container">
        <div className="container">
          <PortalNav langBase="/live_signup" />
          <div className="syntellicore-registration">
            <form
              action=""
              className="form-horizontal"
              method="POST"
              role="form"
              id="registerForm"
              name="registerForm"
              ref={formRef}
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="row margin-bottom-50 div-signup">
                <div className="col-xs-12 col-sm-12 col-md-6 col-md-offset-3">
                  <div className="right-signup-container">
                    <div className="portlet padding-30 ">
                      <h2>Please complete the following form using English alphabet characters only.</h2>
                      <hr />
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <input type="hidden" id="sidi" defaultValue="" />
                        <input type="hidden" id="sidc" defaultValue="" />
                        <input type="hidden" id="slink_id" defaultValue="0" />
                        <input type="hidden" id="a_id" defaultValue="" />
                        <input type="hidden" id="ib_id" defaultValue="" />
                        <input type="hidden" id="su_id" defaultValue="" />
                        <input type="hidden" id="is_ib" defaultValue="0" />
                        <input type="hidden" id="label" defaultValue="" />
                        <input type="hidden" id="is_signup" defaultValue="1" name="is_signup" />
                        <input
                          type="hidden"
                          id="leadmethd"
                          defaultValue="SIGNUP"
                          name="leadmethd"
                        />
                        <input
                          type="hidden"
                          id="autoresponder"
                          defaultValue="PROFILECREATED"
                          name="autoresponder"
                        />
                        <input type="hidden" id="brd" defaultValue="" />
                        <input
                          type="hidden"
                          id="targetval"
                          defaultValue="_self"
                          name="targetval"
                        />
                        <input type="hidden" id="gb" defaultValue="0" />
                        <input type="hidden" id="cstt_id" defaultValue="" />
                        <input type="hidden" id="c_utm_log_id" defaultValue="" />
                        <input type="hidden" id="click_id" defaultValue="" />
                        <input type="hidden" id="lpref" defaultValue="" />
                        <input type="hidden" id="lypref" defaultValue="" />
                        <input type="hidden" id="cl_id" defaultValue="0" />
                        <input type="hidden" id="extended_fields" defaultValue="" />

                        <div className="form-group" id="account_type">
                          <label className="col-md-4 control-label  hidden removable">
                            Account:{" "}
                            <span className="text-primary span-primary-sign-up">*</span>
                          </label>
                          <div className="col-md-8">
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="account"
                                defaultChecked
                                id="individual"
                                onChange={() => setAccountType("individual")}
                              />
                              Individual
                            </label>{" "}
                            <label className="radio-inline">
                              <input
                                type="radio"
                                name="account"
                                id="company"
                                onChange={() => setAccountType("company")}
                              />
                              Company
                            </label>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="account_missing">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Please choose the Account.
                            </div>
                          </div>
                        </div>
                        <div
                          className={`form-group${accountType === "company" ? "" : " hidden"}`}
                          id="company_name_div"
                        >
                          <label htmlFor="company_name" className="control-label hidden removable">
                            Company Name
                          </label>
                          <div className="right_inner_addon">
                            <input
                              type="text"
                              name="company_name"
                              id="company_name"
                              className="form-control"
                              maxLength={64}
                              placeholder="Company Name"
                            />
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="company_missing">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Please fill in the Company Name.
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="company_invalid">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Input is invalid. special characters are not allowed.
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="username-error alert alert-danger fade in" />
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="fname" className="control-label hidden removable">
                            First Name
                          </label>
                          <div className="right_inner_addon">
                            <input
                              type="text"
                              name="fname"
                              id="fname"
                              className="form-control"
                              required
                              maxLength={32}
                              placeholder="First Name"
                            />
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="fname_missing">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Please fill in the First Name.
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="fname_invalid">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Input is invalid. special characters are not allowed.
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="lname" className="control-label hidden removable">
                            Last Name
                          </label>
                          <div className="right_inner_addon">
                            <input
                              type="text"
                              name="lname"
                              id="lname"
                              className="form-control"
                              required
                              maxLength={32}
                              placeholder="Last Name"
                            />
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="lname_missing">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Please fill in the Last Name.
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="lname_invalid">
                          <div className="col-xs-12 col-sm-12 col-md-12">
                            <div className="alert alert-danger fade in">
                              Input is invalid. special characters are not allowed.
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="userEmail" className="control-label hidden removable">
                            Email Address
                          </label>
                          <div className="right_inner_addon">
                            <input
                              type="email"
                              name="userEmail"
                              id="userEmail"
                              className="form-control"
                              required
                              maxLength={127}
                              placeholder="Email Address"
                            />
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="email_exists">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              The email you have entered already exists.
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="email_missing">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Please fill in the Email.
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="invalid_email">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              The email you have entered is invalid
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="userPassword" className="control-label hidden removable">
                            Password
                          </label>
                          <input
                            type="hidden"
                            className="form-control"
                            id="passwordHidden"
                            name="passwordHidden"
                          />
                          <PasswordInput
                            id="userPassword"
                            name="userPassword"
                            placeholder="Password"
                          />
                        </div>
                        <div className="row margin-bottom-10 hidden" id="password_warning">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Password must be at least EIGHT characters long, contain at least 1
                              number, 1 letter and one capital letter. White spaces or special
                              characters are not allowed.
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="password_missing">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Please fill in the Password.
                            </div>
                          </div>
                        </div>
                        <input
                          type="hidden"
                          name="valid_password"
                          id="valid_password"
                          defaultValue="0"
                        />
                        <div className="row margin-bottom-10 hidden" id="valid_password_missing">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Please fill in a Valid Password.
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="confirmUserPassword"
                            className="control-label hidden removable"
                          >
                            Confirm Password
                          </label>
                          <PasswordInput
                            id="confirmUserPassword"
                            name="confirmUserPassword"
                            placeholder="Confirm Password"
                          />
                        </div>
                        <div className="row margin-bottom-10 hidden" id="confirm_password_missing">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Please fill in the Confirm Password.
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="password_missmatch">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">Password mismatch!</div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                              <label htmlFor="cou_id" className="control-label hidden removable">
                                Country of Residence
                              </label>
                              <div className="input-group">
                                <select
                                  className="form-control"
                                  name="cou_id"
                                  id="cou_id"
                                  defaultValue=""
                                >
                                  {countries.map((country, index) =>
                                    index === 0 ? (
                                      <option key="placeholder" value="">
                                        {country.label}
                                      </option>
                                    ) : (
                                      <option
                                        key={country.value}
                                        value={country.value}
                                        data-id={country.dataId}
                                        data-has-pc={country.hasPc ? "1" : "0"}
                                      >
                                        {country.label}
                                      </option>
                                    ),
                                  )}
                                </select>
                                <span className="input-group-addon" id="basic-addon2">
                                  <a
                                    href="#"
                                    data-toggle="tooltip"
                                    data-placement="bottom"
                                    title=""
                                    data-original-title="Tag Markets does not offer  services to US citizens nor US residents for tax purposes, as well as residents of certain other jurisdictions."
                                    onClick={(event) => event.preventDefault()}
                                  >
                                    <i className="fa fa-question" />
                                  </a>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="country_missing">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Please select Country of Residence.
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="row">
                            <div className="tel_country_code col-xs-12 col-sm-4 col-md-4 col-lg-4">
                              <label
                                htmlFor="tel_country_code"
                                className="control-label hidden removable"
                              >
                                Country Code
                              </label>
                              <div className="right_inner_addon">
                                <input
                                  type="text"
                                  name="tel_country_code"
                                  id="tel_country_code"
                                  className="form-control"
                                  placeholder="Country Code"
                                />
                              </div>
                            </div>
                            <div className="tel_provider_code hidden">
                              <label
                                htmlFor="tel_provider_code"
                                className="control-label hidden removable"
                              >
                                Area Code
                              </label>
                              <div className="right_inner_addon">
                                <input
                                  type="text"
                                  name="tel_provider_code"
                                  id="tel_provider_code"
                                  className="form-control"
                                  maxLength={5}
                                  placeholder="Area Code"
                                />
                              </div>
                            </div>
                            <div className="tel_number col-xs-12 col-sm-8 col-md-8 col-lg-8">
                              <label htmlFor="tel" className="control-label hidden removable">
                                Telephone
                              </label>
                              <div className="right_inner_addon">
                                <input
                                  type="text"
                                  name="tel"
                                  id="tel"
                                  className="form-control"
                                  maxLength={12}
                                  placeholder="Telephone"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="tel_country_code_invalid">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Country Code is invalid
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="tel_missing">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Please fill in the Telephone Number.
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="tel_invalid">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">Telephone is invalid</div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="tel_unique">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Telephone number already exists.
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="click_id_invalid">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in" />
                          </div>
                        </div>

                        <div className="currency_default hidden">
                          <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                              <div className="form-group">
                                <label
                                  htmlFor="currency"
                                  className="control-label hidden removable"
                                >
                                  Currency
                                </label>
                                <div className="input-group">
                                  <select
                                    className="form-control "
                                    name="currency"
                                    id="currency"
                                    defaultValue="USD"
                                  >
                                    <option value="USD">USD</option>
                                  </select>
                                  <span
                                    className="input-group-addon text-theme-primary"
                                    id="basic-addon2"
                                  >
                                    <a
                                      href="#"
                                      data-toggle="tooltip"
                                      data-placement="bottom"
                                      title=""
                                      data-original-title="Please choose the main currency of your wallet, e.g. the currency which you will be mainly using to make deposits and withdrawals."
                                      onClick={(event) => event.preventDefault()}
                                    >
                                      <i className="fa fa-question" />
                                    </a>
                                  </span>
                                  <span className="input-group-addon dropdown-custom hidden">
                                    <a>
                                      <i
                                        data-toggle="popover"
                                        data-content=""
                                        data-missing="Please select a Currency."
                                        data-valid="Input is invalid. special characters are not allowed."
                                        data-placement="bottom"
                                        className="fa fa-info-circle fa-lg pop_me_over hidden"
                                      />
                                    </a>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row margin-bottom-10 hidden" id="currency_missing">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="alert alert-danger fade in">
                              Please select a Currency.
                            </div>
                          </div>
                        </div>

                        <input type="hidden" id="service_id" name="service_id" defaultValue="1" />
                        <input type="hidden" id="agreement_id_list" defaultValue="1,3,4" />

                        <div className="form-group">
                          <div className="row">
                            <div className="checkbox">
                              <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 hidden">
                                <span />
                              </div>
                              <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10 agreements_container">
                                <label style={{}}>
                                  <input
                                    className="form-checkbox agreement"
                                    type="checkbox"
                                    data-agreement_id="1"
                                    name=""
                                    id=""
                                    defaultValue="1"
                                  />
                                  {"I have read and accept the "}
                                  <span className="text-danger span-primary-sign-up">*</span>{" "}
                                  <a href="https://portal.tagmarkets.com/assets/pdf/Client%20Agreement_1.pdf" target="_blank">
                                    Client Agreement
                                  </a>
                                  ,
                                  <a
                                    href="https://portal.tagmarkets.com/assets/pdf/Complaint%20Handling%20Policy.cleaned_1.pdf"
                                    target="_blank"
                                  >
                                    Complaint Handling Policy
                                  </a>
                                  ,
                                  <a href="https://portal.tagmarkets.com/assets/pdf/Conflict%20Of%20Interest_1.pdf" target="_blank">
                                    Conflict Of Interest
                                  </a>
                                  ,
                                  <a href="https://portal.tagmarkets.com/assets/pdf/Risk%20Acknowledgement_1.pdf" target="_blank">
                                    Risk Acknowledgement
                                  </a>
                                  ,
                                  <a href="https://portal.tagmarkets.com/assets/pdf/Privacy_1.pdf" target="_blank">
                                    Privacy
                                  </a>
                                </label>
                              </div>
                            </div>
                            <div className="container-fluid">
                              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="help-block hidden alert alert-danger">
                                  Please confirm that you have read and understood all of the
                                  documents.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="row">
                            <div className="checkbox">
                              <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 hidden">
                                <span />
                              </div>
                              <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10 agreements_container">
                                <label style={{}}>
                                  <input
                                    className="form-checkbox agreement"
                                    type="checkbox"
                                    data-agreement_id="3"
                                    name=""
                                    id=""
                                    defaultValue="1"
                                  />
                                  {"I acknowledge CFD trading is highly risky and may not be suitable for all investors. "}
                                  <span className="text-danger span-primary-sign-up">*</span>
                                </label>
                              </div>
                            </div>
                            <div className="container-fluid">
                              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="help-block hidden alert alert-danger">
                                  Please acknowledge by ticking the checkbox before proceeding.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="row">
                            <div className="checkbox">
                              <div className="col-xs-1 col-sm-1 col-md-1 col-lg-1 hidden">
                                <span />
                              </div>
                              <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10 agreements_container">
                                <label style={{}}>
                                  <input
                                    className="form-checkbox agreement"
                                    type="checkbox"
                                    data-agreement_id="4"
                                    name=""
                                    id=""
                                    defaultValue="1"
                                  />
                                  {"I understand that before trading with CFDs or Forex, I should assess my investment goals, experience, and risk tolerance. 80% of retail investors lose money. "}
                                  <span className="text-danger span-primary-sign-up">*</span>
                                </label>
                              </div>
                            </div>
                            <div className="container-fluid">
                              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="help-block hidden alert alert-danger">
                                  Please acknowledge by ticking the checkbox before proceeding.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <input type="hidden" name="langReg" id="langReg" defaultValue="en" />
                        <div className="row">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <button
                              type="button"
                              id="register_new"
                              data-loading-text="<i class='far fa-circle-notch fa-spin'></i> Loading"
                              className="btn btn-lg btn-block btn-theme-secondary btn-submit-sign-up uppercase"
                              onClick={handleRegister}
                              disabled={pending}
                            >
                              Register Now
                            </button>
                            {error ? (
                              <div className="alert alert-danger fade in margin-top-10">
                                {error}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="row">
                          <div className="external-registration-container margin-top-10" />
                        </div>
                        <div className="row pull-right margin-top-10">
                          <span className="font-weight-bold font-size-sm text-primary">
                            Trading Forex &amp; CFDs is Risky
                          </span>
                        </div>
                      </div>
                      <br {...({ clear: "all" } as HTMLAttributes<HTMLBRElement>)} />
                    </div>
                  </div>
                  <div className="" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <PortalFooter />
    </>
  );
}
