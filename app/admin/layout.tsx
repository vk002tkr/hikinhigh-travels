
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  {
    section: "OVERVIEW",
    items: [{ label: "Dashboard", href: "/admin", icon: "dashboard" }],
  },
  {
    section: "MANAGEMENT",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: "bookings" },
      { label: "Customers", href: "/admin/customers", icon: "customers" },
      { label: "Destinations", href: "/admin/destinations", icon: "destinations" },
      { label: "Packages", href: "/admin/packages", icon: "packages" },
      { label: "Hotels", href: "/admin/hotels", icon: "hotels" },
      { label: "Reviews", href: "/admin/reviews", icon: "reviews" },
    ],
  },
  {
    section: "PREFERENCES",
    items: [{ label: "Settings", href: "/admin/settings", icon: "settings" }],
  },
];

function Icon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<string, ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>,
    bookings: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    customers: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    destinations: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    packages: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5M12 13v8" /></>,
    hotels: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M7 21v-5h10v5M7 8h3v3H7zM14 8h3v3h-3z" /></>,
    reviews: <><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19 13 2 1.5-2 3.5-2.3-.8a8 8 0 0 1-2 1.2L14.3 21h-4.6l-.4-2.6a8 8 0 0 1-2-1.2l-2.3.8-2-3.5L5 13a8 8 0 0 1 0-2L3 9.5 5 6l2.3.8a8 8 0 0 1 2-1.2L9.7 3h4.6l.4 2.6a8 8 0 0 1 2 1.2L19 6l2 3.5-2 1.5a8 8 0 0 1 0 2Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
  };

  return (
    <svg {...common} aria-hidden="true">
      {paths[name] ?? paths.dashboard}
    </svg>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentItem = navigation
    .flatMap((group) => group.items)
    .find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
    );

  const pageTitle = currentItem?.label ?? "Admin";
  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex h-[82px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-xl font-bold text-white">
            H
          </div>
          <div>
            <div className="text-[17px] font-extrabold tracking-tight text-slate-900">
              Hikinhigh
            </div>
            <div className="mt-0.5 text-[10px] font-bold tracking-[2.2px] text-slate-400">
              TRAVELS ADMIN
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
            className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {navigation.map((group) => (
            <div key={group.section} className="mb-7">
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.8px] text-slate-400">
                {group.section}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-semibold transition ${
                        active
                          ? "bg-emerald-50 text-emerald-800 shadow-sm"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon name={item.icon} size={19} />
                      <span>{item.label}</span>
                      {item.label === "Bookings" && (
                        <span className="ml-auto rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          8
                        </span>
                      )}
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800">
              HA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">
                Hikinhigh Admin
              </p>
              <p className="mt-1 truncate text-[11px] text-slate-500">
                Administrator
              </p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="px-2 text-[10px] text-slate-400">
            Hikinhigh Travels · Admin Panel
          </p>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[260px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-7 lg:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"
            >
              <Icon name="menu" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="hidden sm:inline">Hikinhigh Travels</span>
                <span className="hidden sm:inline">/</span>
                <span className="truncate font-semibold text-slate-700">
                  {pageTitle}
                </span>
              </div>
              <h1 className="mt-1 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {pageTitle}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <div className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 md:flex">
              <Icon name="search" size={17} />
              <span className="text-xs text-slate-400">Admin workspace</span>
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Icon name="bell" size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-slate-800">Administrator</p>
              <p className="mt-1 text-[10px] text-slate-400">
                Travel Operations
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-800">
              HA
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
