"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building2, Inbox, Activity, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Deals", href: "/deals", icon: Inbox },
  { name: "Contacts", href: "/contacts", icon: Users },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Activity", href: "/activity", icon: Activity },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-sidebar border-r border-border-divider transition-all duration-300 z-20",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Brand */}
      <div className="flex items-center h-16 px-4 border-b border-border-divider shrink-0 overflow-hidden">
        <div className="w-8 h-8 flex items-center justify-center shrink-0">
          <img src="/sokara-logomark-transparent-dark.svg" alt="Sokara Logo" className="w-8 h-8 dark:hidden" />
          <img src="/sokara-logomark-transparent-light.svg" alt="Sokara Logo" className="w-8 h-8 hidden dark:block" />
        </div>
        <span
          className={cn(
            "ml-3 font-semibold text-lg text-text-primary whitespace-nowrap transition-opacity duration-300 tracking-[1px]",
            !isSidebarOpen && "opacity-0"
          )}
          style={{ fontFamily: 'var(--font-poppins)' }}
        >
          Sokara <span className="font-normal opacity-70">CRM</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-2 py-2 rounded-lg group transition-colors",
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-text-secondary hover:bg-hover hover:text-text-primary"
              )}
              title={!isSidebarOpen ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span
                className={cn(
                  "ml-3 whitespace-nowrap transition-opacity duration-300 text-sm font-medium",
                  !isSidebarOpen && "opacity-0 hidden"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Settings */}
      <div className="p-2 border-t border-border-divider shrink-0">
        <Link
          href="/settings"
          className="flex items-center px-2 py-2 rounded-lg text-text-secondary hover:bg-hover hover:text-text-primary transition-colors"
          title={!isSidebarOpen ? "Settings" : undefined}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span
            className={cn(
              "ml-3 whitespace-nowrap transition-opacity duration-300 text-sm font-medium",
              !isSidebarOpen && "opacity-0 hidden"
            )}
          >
            Settings
          </span>
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-elevated border border-border-divider text-text-muted hover:text-text-primary flex items-center justify-center shadow-sm z-30"
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  );
}
