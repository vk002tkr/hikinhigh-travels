
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

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
      { label: "Cruise Catalogue", href: "/admin/cruises", icon: "cruises" },
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
    cruises: <><path d="M3 17h18l-2 3H5l-2-3Z" /><path d="M6 17V8h12v9M9 8V4h6v4M3 12h3M18 12h3" /></>,
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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [adminRole, setAdminRole] = useState("Administrator");
  const [adminEmail, setAdminEmail] = useState("");
  const [pendingBookings, setPendingBookings] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; href: string | null; is_read: boolean; created_at: string }>>([]);
  const [notificationsError, setNotificationsError] = useState("");
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const loadNotifications = async (showLoading = false) => {
    if (showLoading) setNotificationsLoading(true);
    setNotificationsError("");
    const { data, error } = await supabase
      .from("admin_notifications")
      .select("id, title, message, href, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) {
      setNotificationsError(error.message);
      setNotifications([]);
    } else {
      setNotifications((data ?? []) as Array<{ id: string; title: string; message: string; href: string | null; is_read: boolean; created_at: string }>);
    }
    if (showLoading) setNotificationsLoading(false);
  };

  const markNotificationRead = async (id: string) => {
    const { error } = await supabase.from("admin_notifications").update({ is_read: true }).eq("id", id);
    if (error) {
      setNotificationsError(error.message);
      return;
    }
    setNotifications((current) => current.map((item) => item.id === id ? { ...item, is_read: true } : item));
  };

  const markAllNotificationsRead = async () => {
    const unreadIds = notifications.filter((item) => !item.is_read).map((item) => item.id);
    if (!unreadIds.length) return;
    const { error } = await supabase.from("admin_notifications").update({ is_read: true }).in("id", unreadIds);
    if (error) {
      setNotificationsError(error.message);
      return;
    }
    setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
  };

  useEffect(() => {
    let mounted = true;
    let authEventHandled = false;

    const verifySession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!mounted) return;
      if (sessionError || !session?.user) {
        setAuthChecking(false);
        router.replace("/login?next=/admin");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, role, is_active")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!mounted) return;
      if (profileError || !profile || !profile.is_active || !["admin", "staff"].includes(String(profile.role).toLowerCase())) {
        await supabase.auth.signOut();
        if (!mounted) return;
        setAuthChecking(false);
        router.replace("/login?next=/admin&reason=unauthorized");
        return;
      }

      setAdminName(profile.full_name?.trim() || session.user.email?.split("@")[0] || "Admin");
      setAdminRole(String(profile.role).toLowerCase() === "admin" ? "Administrator" : "Staff");
      setAdminEmail(session.user.email || "");
      const { count } = await supabase.from("bookings").select("id", { count: "exact", head: true }).in("booking_status", ["pending", "requested", "processing"]);
      if (mounted) {
        setPendingBookings(count ?? 0);
        setAuthChecking(false);
      }
    };

    void verifySession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && mounted && !authEventHandled) {
        authEventHandled = true;
        router.replace("/login?next=/admin");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (authChecking) return;

    let active = true;
    void loadNotifications();

    // Receive database changes immediately. Keep a periodic refresh as a
    // fallback in case the Realtime connection temporarily disconnects.
    const channel = supabase
      .channel("admin-notifications-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "admin_notifications",
        },
        () => {
          if (active) void loadNotifications();
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("Admin notification Realtime status:", status);
        }
      });

    const timer = window.setInterval(() => {
      if (active) void loadNotifications();
    }, 60000);

    return () => {
      active = false;
      window.clearInterval(timer);
      void supabase.removeChannel(channel);
    };
  }, [authChecking]);

  const unreadNotifications = notifications.filter((item) => !item.is_read).length;

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Admin sign-out error:", error);
      setSigningOut(false);
      return;
    }
    router.replace("/login");
    router.refresh();
  };

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

  if (authChecking) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb] text-slate-600"><div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm"><div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" /><p className="text-sm font-semibold">Verifying admin access…</p></div></div>;
  }

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
                          {pendingBookings}
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
              {adminName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">
                {adminName}
              </p>
              <p className="mt-1 truncate text-[11px] text-slate-500">
                {adminRole}
              </p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <button type="button" onClick={handleSignOut} disabled={signingOut} className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-left text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60">
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
          <p className="px-2 text-[10px] text-slate-400">Hikinhigh Travels · Admin Panel</p>
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
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => {
                  const nextOpen = !notificationsOpen;
                  setNotificationsOpen(nextOpen);
                  if (nextOpen) void loadNotifications(true);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <Icon name="bell" size={19} />
                {unreadNotifications > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[9px] font-bold text-white">{unreadNotifications > 9 ? "9+" : unreadNotifications}</span>}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-[60] w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <div><p className="text-sm font-bold text-slate-900">Notifications</p><p className="mt-0.5 text-xs text-slate-500">{unreadNotifications} unread</p></div>
                    <div className="flex items-center gap-2"><button type="button" onClick={() => void loadNotifications(true)} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">Refresh</button><button type="button" onClick={() => void markAllNotificationsRead()} disabled={!unreadNotifications} className="text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-40">Mark all read</button></div>
                  </div>
                  <div className="max-h-[min(65vh,420px)] overflow-y-auto">
                    {notificationsLoading ? <p className="px-4 py-8 text-center text-sm text-slate-500">Loading notifications…</p> : notificationsError ? <div className="p-4"><p className="text-sm font-semibold text-rose-700">Notifications unavailable</p><p className="mt-1 break-words text-xs text-rose-600">{notificationsError}</p><p className="mt-2 text-xs text-slate-500">Run the notification-table SQL setup provided with this update.</p></div> : notifications.length === 0 ? <div className="px-4 py-9 text-center"><div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500"><Icon name="bell" /></div><p className="text-sm font-semibold text-slate-800">You’re all caught up</p><p className="mt-1 text-xs text-slate-500">New booking and enquiry alerts will appear here.</p></div> : notifications.map((notification) => <button key={notification.id} type="button" onClick={() => { void markNotificationRead(notification.id); setNotificationsOpen(false); if (notification.href) router.push(notification.href); }} className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${notification.is_read ? "bg-white" : "bg-emerald-50/60"}`}><div className="flex items-start gap-3"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.is_read ? "bg-slate-200" : "bg-emerald-600"}`} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{notification.title}</span><span className="mt-1 block text-xs leading-5 text-slate-600">{notification.message}</span><span className="mt-1.5 block text-[10px] text-slate-400">{Number.isNaN(new Date(notification.created_at).getTime()) ? "Just now" : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(notification.created_at))}</span></span></div></button>)}
                  </div>
                  <div className="border-t border-slate-100 p-3"><button type="button" onClick={() => { setNotificationsOpen(false); router.push("/admin/bookings"); }} className="w-full rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">Open bookings</button></div>
                </div>
              )}
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-slate-800">{adminName}</p>
              <p className="mt-1 max-w-[180px] truncate text-[10px] text-slate-400" title={adminEmail}>
                {adminRole}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-800">
              {adminName.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
