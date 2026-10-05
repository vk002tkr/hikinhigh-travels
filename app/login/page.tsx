"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      /*
       * STEP 1
       * Authenticate the user with Supabase Auth.
       */
      const { data: authData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Unable to sign in. Please try again.");
        setLoading(false);
        return;
      }

      /*
       * STEP 2
       * Load the user's profile.
       */
      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id, full_name, role, is_active")
        .eq("id", authData.user.id)
        .maybeSingle();

      /*
       * IMPORTANT:
       * Show the actual Supabase error instead of hiding it behind
       * a generic profile error.
       */
      if (profileError) {
        console.error("Profile loading error:", profileError);

        await supabase.auth.signOut();

        setError(
          `Profile error: ${profileError.message}${
            profileError.code
              ? ` (Code: ${profileError.code})`
              : ""
          }`
        );

        setLoading(false);
        return;
      }

      /*
       * STEP 3
       * Profile does not exist.
       */
      if (!profile) {
        await supabase.auth.signOut();

        setError(
          "Your account exists, but your profile could not be found. Please contact support."
        );

        setLoading(false);
        return;
      }

      /*
       * STEP 4
       * Check account status.
       */
      if (!profile.is_active) {
        await supabase.auth.signOut();

        setError(
          "Your account is currently inactive. Please contact support."
        );

        setLoading(false);
        return;
      }

      /*
       * STEP 5
       * Redirect according to role.
       */
      setSuccess("Login successful. Redirecting...");

      if (profile.role === "admin" || profile.role === "staff") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }

      router.refresh();
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while signing you in.";

      setError(message);
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      {/* =========================================
          LEFT VISUAL
      ========================================= */}

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
            <p className={styles.eyebrow}>WELCOME BACK</p>

            <h1 className={styles.quote}>
              Travel
              <br />
              <em>further.</em>
            </h1>

            <p className={styles.quoteText}>
              Your next journey is waiting. Sign in to continue
              exploring stays, journeys and experiences around
              the world.
            </p>
          </div>

          <div className={styles.location}>
            <span>HIKINHIGH TRAVELS</span>
            <span>TRAVEL BEYOND THE ORDINARY</span>
          </div>
        </div>
      </section>

      {/* =========================================
          RIGHT PANEL
      ========================================= */}

      <section className={styles.panel}>
        <div className={styles.panelInner}>
          {/* Mobile logo */}

          <div className={styles.mobileLogo}>
            <Link href="/">
              <img
                src="/images/hikinhigh-logo.png"
                alt="Hikinhigh Travels"
              />
            </Link>
          </div>

          {/* Heading */}

          <div className={styles.headingBlock}>
            <p className={styles.kicker}>ACCOUNT</p>

            <h2 className={styles.heading}>
              Welcome
              <br />
              <em>back.</em>
            </h2>

            <p className={styles.subheading}>
              Sign in to access your Hikinhigh Travels account.
            </p>
          </div>

          {/* Login form */}

          <form
            className={styles.form}
            onSubmit={handleLogin}
            noValidate
          >
            {/* Email */}

            <div className={styles.field}>
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* Password */}

            <div className={styles.field}>
              <div className={styles.passwordLabel}>
                <label htmlFor="password">Password</label>

                <Link href="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Error */}

            {error && (
              <div
                className={`${styles.message} ${styles.error}`}
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Success */}

            {success && (
              <div
                className={`${styles.message} ${styles.success}`}
                role="status"
              >
                {success}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              className={styles.submit}
              disabled={loading}
            >
              <span>
                {loading ? "Signing in..." : "Sign in"}
              </span>

              {!loading && (
                <span className={styles.arrow}>→</span>
              )}
            </button>
          </form>

          {/* Divider */}

          <div className={styles.divider}>
            <span />
            <p>OR</p>
            <span />
          </div>

          {/* Register */}

          <div className={styles.register}>
            <p>Don&apos;t have an account?</p>

            <Link href="/register">
              Create an account
              <span>↗</span>
            </Link>
          </div>

          {/* Footer */}

          <div className={styles.footer}>
            <Link href="/">Back to Hikinhigh</Link>

            <span>•</span>

            <Link href="/privacy-policy">Privacy</Link>

            <span>•</span>

            <Link href="/terms-conditions">Terms</Link>
          </div>
        </div>
      </section>
    </main>
  );
}