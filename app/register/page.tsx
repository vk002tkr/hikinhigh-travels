"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!cleanPhone) {
      setError("Please enter your phone number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Registration could not be completed. Please try again.");
        setLoading(false);
        return;
      }

      /*
       * If Supabase email confirmation is enabled,
       * session will normally be null here.
       *
       * If email confirmation is disabled,
       * the user can be logged in immediately.
       */
      if (!data.session) {
        setSuccess(
          "Account created successfully. Please check your email to verify your account before logging in."
        );
        setLoading(false);
        return;
      }

      setSuccess("Account created successfully. Redirecting...");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 700);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        "Something went wrong while creating your account. Please try again."
      );

      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.visual}>
        <div className={styles.visualOverlay} />

        <div className={styles.visualContent}>
          <Link href="/" className={styles.logo}>
            <img
              src="/images/hikinhigh-logo.png"
              alt="Hikinhigh Travels"
            />
          </Link>

          <div className={styles.quoteBlock}>
            <p className={styles.eyebrow}>START YOUR JOURNEY</p>

            <h2 className={styles.quote}>
              The world is waiting.
              <br />
              <em>Go beyond the ordinary.</em>
            </h2>

            <p className={styles.location}>
              Journeys · Stays · Experiences · Worldwide
            </p>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelInner}>
          <Link href="/" className={styles.mobileLogo}>
            <img
              src="/images/hikinhigh-logo.png"
              alt="Hikinhigh Travels"
            />
          </Link>

          <div className={styles.headingBlock}>
            <p className={styles.kicker}>HIKINHIGH TRAVELS</p>

            <h1 className={styles.heading}>
              Create your
              <br />
              <em>account.</em>
            </h1>

            <p className={styles.subheading}>
              Join Hikinhigh and start planning journeys worth remembering.
            </p>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className={styles.field}>
              <label htmlFor="fullName">Full name</label>

              <input
                id="fullName"
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Phone number</label>

              <input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                disabled={loading}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>

              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className={styles.helper}>
                Use at least 6 characters.
              </p>
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm password</label>

              <div className={styles.passwordWrapper}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  disabled={loading}
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className={`${styles.message} ${styles.error}`}>
                {error}
              </div>
            )}

            {success && (
              <div className={`${styles.message} ${styles.success}`}>
                {success}
              </div>
            )}

            <button
              type="submit"
              className={styles.submit}
              disabled={loading}
            >
              <span>
                {loading ? "Creating account..." : "Create account"}
              </span>

              {!loading && <span className={styles.arrow}>→</span>}
            </button>
          </form>

          <div className={styles.divider}>
            <span />
            <p>Already a member?</p>
            <span />
          </div>

          <Link href="/login" className={styles.loginLink}>
            Sign in to your account
          </Link>

          <p className={styles.footer}>
            By creating an account, you agree to our{" "}
            <Link href="/terms-conditions">Terms & Conditions</Link>{" "}
            and{" "}
            <Link href="/privacy-policy">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}