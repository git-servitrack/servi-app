"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, ExternalLink, LogOut, Menu, User } from "lucide-react";

import { useSidebar } from "@/components/providers/sidebar-provider";
import { ROUTES } from "@/constants/routes";
import { authService, clearAuthTokens, notificationsService } from "@/services";
import type { CurrentUserResponse } from "@/services/auth/contracts";
import type { NotificationRecord } from "@/services/notifications/contracts";

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2);

  return initials || "SW";
}

function formatNotificationDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function DashboardHeader() {
  const router = useRouter();
  const { openMobile } = useSidebar();
  const [currentUser, setCurrentUser] = useState<CurrentUserResponse | null>(null);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationRecord | null>(null);
  const [signOutModal, setSignOutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const fullName = currentUser?.session.fullName ?? "SERVI-WEB User";
  const email = currentUser?.user.email ?? "Signed in";
  const roleLabel = currentUser?.session.roleLabel ?? "Workspace account";
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  useEffect(() => {
    let active = true;

    async function loadHeaderData() {
      const [userResult, notificationResult, countResult] = await Promise.all([
        authService.getCurrentUser(),
        notificationsService.list(),
        notificationsService.unreadCount(),
      ]);

      if (!active) return;

      if (userResult.data) setCurrentUser(userResult.data);
      if (notificationResult.data) setNotifications(notificationResult.data);
      if (countResult.data) setUnreadCount(countResult.data.count);
    }

    void loadHeaderData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleSignOut() {
    clearAuthTokens();
    setSignOutModal(false);
    router.replace(ROUTES.signIn);
  }

  async function handleMarkAllRead() {
    const result = await notificationsService.markAllAsRead();
    if (result.error) return;

    const now = new Date().toISOString();
    setNotifications((items) => items.map((item) => ({ ...item, readAt: item.readAt ?? now })));
    setUnreadCount(0);
  }

  async function handleOpenNotification(notification: NotificationRecord) {
    setSelectedNotification(notification);
    setNotificationsOpen(false);

    if (notification.readAt) return;

    const result = await notificationsService.markAsRead(notification.id);
    const readAt = result.data?.readAt ?? new Date().toISOString();

    setNotifications((items) =>
      items.map((item) => (item.id === notification.id ? { ...item, readAt } : item)),
    );
    setUnreadCount((count) => Math.max(0, count - 1));
    if (result.data) setSelectedNotification(result.data);
  }

  return (
    <>
      <div className="sticky top-0 z-20 flex h-[60px] items-center justify-between gap-2 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl dark:border-white/8 dark:bg-[#11120f]/95 sm:px-6">
        <button
          onClick={openMobile}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-white/8 dark:text-stone-400 dark:hover:bg-white/12 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => setNotificationsOpen((v) => !v)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-white/8 dark:text-stone-400 dark:hover:bg-white/12"
              aria-label="Open notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#145d66] px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#11120f]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </button>

            <AnimatePresence>
              {notificationsOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full z-50 mt-2 w-[min(calc(100vw-2rem),24rem)] origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1d1b]"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-white/8">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-stone-100">
                        Notifications
                      </p>
                      <p className="text-xs text-slate-400 dark:text-stone-500">
                        {unreadCount} unread
                      </p>
                    </div>
                    <button
                      onClick={handleMarkAllRead}
                      disabled={unreadCount === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#145d66] disabled:pointer-events-none disabled:opacity-40 dark:text-stone-500 dark:hover:bg-white/8 dark:hover:text-[#86d0d8]"
                      aria-label="Mark all notifications as read"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="max-h-[22rem] overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                      <div className="px-3 py-8 text-center text-sm text-slate-500 dark:text-stone-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const unread = !notification.readAt;

                        return (
                          <button
                            key={notification.id}
                            onClick={() => handleOpenNotification(notification)}
                            className="flex w-full gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/6"
                          >
                            <span
                              className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                                unread ? "bg-[#145d66]" : "bg-slate-200 dark:bg-white/15"
                              }`}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-slate-900 dark:text-stone-100">
                                {notification.title}
                              </span>
                              <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-slate-500 dark:text-stone-400">
                                {notification.message}
                              </span>
                              <span className="mt-1 block text-[11px] font-medium text-slate-400 dark:text-stone-500">
                                {formatNotificationDate(notification.createdAt)}
                              </span>
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div
            ref={dropdownRef}
            className="relative ml-2 border-l border-slate-200 pl-4 dark:border-white/8"
          >
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-3 rounded-full transition-opacity hover:opacity-80"
            >
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                  {fullName}
                </p>
                <p className="text-xs text-slate-400 dark:text-stone-500">{email}</p>
              </div>
              {currentUser?.user.avatar ? (
                <span
                  aria-label={fullName}
                  role="img"
                  className="h-9 w-9 rounded-full bg-cover bg-center shadow-sm"
                  style={{ backgroundImage: `url(${currentUser.user.avatar})` }}
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#145d66] text-sm font-bold text-white shadow-sm">
                  {initials}
                </div>
              )}
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1d1b]"
                >
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-white/8">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-stone-100">
                      {fullName}
                    </p>
                    <p className="truncate text-xs text-slate-400 dark:text-stone-500">{email}</p>
                    <p className="mt-1 truncate text-[11px] font-medium text-[#145d66] dark:text-[#86d0d8]">
                      {roleLabel}
                    </p>
                  </div>

                  <div className="p-1.5">
                    <Link
                      href={ROUTES.profile}
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-stone-300 dark:hover:bg-white/6"
                    >
                      <User className="h-4 w-4 text-slate-400 dark:text-stone-500" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setSignOutModal(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedNotification ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            onClick={() => setSelectedNotification(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#1a1d1b]"
            >
              <p className="text-xs font-semibold uppercase text-[#145d66] dark:text-[#86d0d8]">
                {selectedNotification.type}
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-stone-100">
                {selectedNotification.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-stone-400">
                {selectedNotification.message}
              </p>
              <p className="mt-4 text-xs text-slate-400 dark:text-stone-500">
                {formatNotificationDate(selectedNotification.createdAt)}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
                >
                  Close
                </button>
                {selectedNotification.link ? (
                  <Link
                    href={selectedNotification.link}
                    onClick={() => setSelectedNotification(null)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#145d66] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0e4d55]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </Link>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {signOutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setSignOutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 w-full max-w-sm rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#1a1d1b]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/10">
                <LogOut className="h-5 w-5 text-rose-500 dark:text-rose-400" />
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-stone-100">
                Sign out?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-stone-400">
                You&apos;ll be redirected to the sign-in page. Any unsaved work may be lost.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSignOutModal(false)}
                  className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex-1 rounded-full bg-rose-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-600"
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
