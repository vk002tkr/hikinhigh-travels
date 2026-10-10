
"use client";

import { useState, type FormEvent } from "react";

type SettingsTab = "general" | "booking" | "notifications";

type SiteSettings = {
  siteName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  currency: string;
  timezone: string;
  bookingPrefix: string;
  cancellationHours: string;
  requireApproval: boolean;
  allowGuestBooking: boolean;
  emailNotifications: boolean;
  bookingNotifications: boolean;
  reviewNotifications: boolean;
  marketingNotifications: boolean;
};

const initialSettings: SiteSettings = {
  siteName: "Hikinhigh Travels",
  tagline: "Discover your next adventure",
  supportEmail: "support@hikinhigh.com",
  supportPhone: "",
  address: "",
  currency: "INR",
  timezone: "Asia/Kolkata",
  bookingPrefix: "HHT",
  cancellationHours: "48",
  requireApproval: false,
  allowGuestBooking: true,
  emailNotifications: true,
  bookingNotifications: true,
  reviewNotifications: true,
  marketingNotifications: false,
};

const currencyOptions = [
  { value: "INR", label: "INR — Indian Rupee (₹)" },
  { value: "USD", label: "USD — US Dollar ($)" },
  { value: "EUR", label: "EUR — Euro (€)" },
  { value: "GBP", label: "GBP — British Pound (£)" },
  { value: "AED", label: "AED — UAE Dirham" },
];

const timezoneOptions = [
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Europe/London", label: "London" },
  { value: "America/New_York", label: "Eastern Time (US)" },
  { value: "UTC", label: "UTC" },
];

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<SiteSettings>(initialSettings);
  const [activeTab, setActiveTab] =
    useState<SettingsTab>("general");
  const [savedMessage, setSavedMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateSetting<K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K]
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSavedMessage("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSavedMessage("");

    // Demo only: this does not persist settings to a database.
    window.setTimeout(() => {
      setSaving(false);
      setSavedMessage(
        "Settings updated in this session. Database saving is not connected yet."
      );
    }, 400);
  }

  function resetSettings() {
    const confirmed = window.confirm(
      "Reset all settings to their initial demo values?"
    );

    if (confirmed) {
      setSettings({ ...initialSettings });
      setSavedMessage("");
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-[#f7f9f8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-emerald-700">
              Preferences / Settings
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Settings
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Manage your website and booking preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={resetSettings}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Reset Demo Settings
          </button>
        </div>

        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-blue-700">
              ℹ
            </span>
            <div>
              <p className="font-semibold text-blue-900">
                Configuration preview
              </p>
              <p className="mt-1 text-sm leading-6 text-blue-800">
                These controls currently update the page state only. They do
                not change your public website, payment currency, booking
                behaviour, or email delivery until backend integration is
                implemented.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex gap-1 overflow-x-auto border-b border-gray-100 p-3 sm:px-5">
            <TabButton
              active={activeTab === "general"}
              onClick={() => setActiveTab("general")}
            >
              <span>⚙</span> General
            </TabButton>
            <TabButton
              active={activeTab === "booking"}
              onClick={() => setActiveTab("booking")}
            >
              <span>▣</span> Booking
            </TabButton>
            <TabButton
              active={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
            >
              <span>♧</span> Notifications
            </TabButton>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-5 sm:p-7">
              {activeTab === "general" && (
                <div className="space-y-7">
                  <SectionHeading
                    title="General Information"
                    description="Basic details displayed across your travel website."
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className={labelClass}>
                      Website Name *
                      <input
                        required
                        value={settings.siteName}
                        onChange={(event) =>
                          updateSetting("siteName", event.target.value)
                        }
                        className={inputClass}
                        placeholder="Hikinhigh Travels"
                      />
                    </label>

                    <label className={labelClass}>
                      Website Tagline
                      <input
                        value={settings.tagline}
                        onChange={(event) =>
                          updateSetting("tagline", event.target.value)
                        }
                        className={inputClass}
                        placeholder="Your travel tagline"
                      />
                    </label>

                    <label className={labelClass}>
                      Support Email *
                      <input
                        required
                        type="email"
                        value={settings.supportEmail}
                        onChange={(event) =>
                          updateSetting("supportEmail", event.target.value)
                        }
                        className={inputClass}
                        placeholder="support@example.com"
                      />
                    </label>

                    <label className={labelClass}>
                      Support Phone
                      <input
                        type="tel"
                        value={settings.supportPhone}
                        onChange={(event) =>
                          updateSetting("supportPhone", event.target.value)
                        }
                        className={inputClass}
                        placeholder="+91 00000 00000"
                      />
                    </label>

                    <label className={`${labelClass} sm:col-span-2`}>
                      Business Address
                      <textarea
                        rows={3}
                        value={settings.address}
                        onChange={(event) =>
                          updateSetting("address", event.target.value)
                        }
                        className={inputClass}
                        placeholder="Enter your business address"
                      />
                    </label>

                    <label className={labelClass}>
                      Display Currency
                      <select
                        value={settings.currency}
                        onChange={(event) =>
                          updateSetting("currency", event.target.value)
                        }
                        className={inputClass}
                      >
                        {currencyOptions.map((currency) => (
                          <option
                            key={currency.value}
                            value={currency.value}
                          >
                            {currency.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={labelClass}>
                      Default Timezone
                      <select
                        value={settings.timezone}
                        onChange={(event) =>
                          updateSetting("timezone", event.target.value)
                        }
                        className={inputClass}
                      >
                        {timezoneOptions.map((timezone) => (
                          <option
                            key={timezone.value}
                            value={timezone.value}
                          >
                            {timezone.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "booking" && (
                <div className="space-y-7">
                  <SectionHeading
                    title="Booking Preferences"
                    description="Configure default booking options for future backend integration."
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className={labelClass}>
                      Booking Reference Prefix
                      <input
                        required
                        minLength={2}
                        maxLength={8}
                        value={settings.bookingPrefix}
                        onChange={(event) =>
                          updateSetting(
                            "bookingPrefix",
                            event.target.value.toUpperCase()
                          )
                        }
                        className={inputClass}
                        placeholder="HHT"
                      />
                      <span className="mt-1.5 block text-xs font-normal text-gray-500">
                        Example reference: HHT-000123
                      </span>
                    </label>

                    <label className={labelClass}>
                      Cancellation Notice (Hours)
                      <input
                        required
                        type="number"
                        min="0"
                        max="720"
                        value={settings.cancellationHours}
                        onChange={(event) =>
                          updateSetting(
                            "cancellationHours",
                            event.target.value
                          )
                        }
                        className={inputClass}
                      />
                      <span className="mt-1.5 block text-xs font-normal text-gray-500">
                        Intended default cancellation notice period.
                      </span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <ToggleRow
                      title="Require Admin Approval"
                      description="Mark new bookings for admin approval when the booking workflow is connected."
                      checked={settings.requireApproval}
                      onChange={(checked) =>
                        updateSetting("requireApproval", checked)
                      }
                    />

                    <ToggleRow
                      title="Allow Guest Booking"
                      description="Allow customers to book without creating an account, when supported."
                      checked={settings.allowGuestBooking}
                      onChange={(checked) =>
                        updateSetting("allowGuestBooking", checked)
                      }
                    />
                  </div>

                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                    These are saved as form values only. They do not currently
                    enforce approval or cancellation rules.
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-7">
                  <SectionHeading
                    title="Notification Preferences"
                    description="Choose which notification categories you intend to enable."
                  />

                  <div className="space-y-4">
                    <ToggleRow
                      title="Email Notifications"
                      description="Master preference for email-related notifications."
                      checked={settings.emailNotifications}
                      onChange={(checked) =>
                        updateSetting("emailNotifications", checked)
                      }
                    />

                    <ToggleRow
                      title="Booking Notifications"
                      description="Receive alerts for new bookings and booking updates."
                      checked={settings.bookingNotifications}
                      onChange={(checked) =>
                        updateSetting("bookingNotifications", checked)
                      }
                      disabled={!settings.emailNotifications}
                    />

                    <ToggleRow
                      title="Review Notifications"
                      description="Receive alerts when customers submit reviews."
                      checked={settings.reviewNotifications}
                      onChange={(checked) =>
                        updateSetting("reviewNotifications", checked)
                      }
                      disabled={!settings.emailNotifications}
                    />

                    <ToggleRow
                      title="Marketing Notifications"
                      description="Receive promotional campaign and marketing-related alerts."
                      checked={settings.marketingNotifications}
                      onChange={(checked) =>
                        updateSetting("marketingNotifications", checked)
                      }
                      disabled={!settings.emailNotifications}
                    />
                  </div>

                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                    Email delivery is not configured by this page. A backend
                    notification service will be required to send actual
                    emails.
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div aria-live="polite">
                {savedMessage && (
                  <p className="text-sm font-medium text-emerald-700">
                    {savedMessage}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoCard
            title="Website Configuration"
            description="Manage your public website information and support contact details."
            icon="🌐"
          />
          <InfoCard
            title="Booking Configuration"
            description="Review booking preferences before connecting them to your booking workflow."
            icon="✈️"
          />
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-emerald-50 text-emerald-800"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="mt-1.5 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-xl border border-gray-100 p-4 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-emerald-600" : "bg-gray-300"
        } disabled:cursor-not-allowed`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function InfoCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}
