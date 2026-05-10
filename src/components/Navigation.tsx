"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/Button";
import {
  Home,
  FileQuestion,
  TestTube2,
  Calendar,
  BarChart3,
  BookOpen,
  Settings,
  LogOut,
  Flame,
  Menu,
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  User,
  LogOut as LogOutIcon,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home", public: true },
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/practice", icon: FileQuestion, label: "Practice" },
  { href: "/mocks", icon: TestTube2, label: "Mocks" },
  { href: "/planner", icon: Calendar, label: "Planner" },
  { href: "/progress", icon: BarChart3, label: "Progress" },
  { href: "/resources", icon: BookOpen, label: "Resources" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const filteredNavItems = navItems.filter((item) => {
    if (item.public) return true;
    return isAuthenticated || pathname === "/login" || pathname === "/register";
  });

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-navy-light border-r border-slate/10 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate/10">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-emerald-400 flex items-center justify-center">
              <span className="text-navy font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-white">Ledger</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-navy transition-colors"
        >
          <Menu className="w-5 h-5 text-slate" />
        </button>
      </div>

      <nav className="p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive
                  ? "bg-teal/10 text-teal border-l-4 border-teal"
                  : "text-slate hover:bg-navy hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isAuthenticated && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate/10">
          <div className={cn(collapsed ? "flex justify-center" : "")}>
            {!collapsed && (
              <div 
                className="flex items-center gap-3 p-3 bg-navy rounded-xl cursor-pointer hover:bg-navy-light transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-emerald-400 flex items-center justify-center">
                  <span className="text-navy font-bold text-sm">{user?.avatar || "U"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate truncate">{user?.email}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate" />
              </div>
            )}
          </div>

          {showUserMenu && !collapsed && (
            <div className="mt-2 p-2 bg-navy rounded-xl">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-light text-slate hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy-light text-slate hover:text-red-400 transition-colors"
              >
                <LogOutIcon className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}

          {!collapsed && (
            <div className="flex items-center gap-2 mt-3 bg-amber-500/20 px-3 py-2 rounded-lg">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-medium text-sm">7 Day Streak</span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated && pathname !== "/login" && pathname !== "/register") {
    return null;
  }

  return (
    <header className="sticky top-0 z-30 bg-navy/80 backdrop-blur-xl border-b border-slate/10">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 rounded-lg hover:bg-navy-light transition-colors md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu className="w-5 h-5 text-slate" />
          </button>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
            <input
              type="text"
              placeholder="Search questions, topics..."
              className="w-64 md:w-96 pl-10 pr-4 py-2 bg-navy-light border border-slate/20 rounded-xl text-sm text-white placeholder:text-slate focus:outline-none focus:border-teal transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-navy-light transition-colors">
            <Bell className="w-5 h-5 text-slate" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-teal rounded-full"></span>
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-3 border-l border-slate/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal to-emerald-400 flex items-center justify-center">
                  <span className="text-navy font-bold text-sm">{user?.avatar || "U"}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate capitalize">{user?.level} Level</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-navy-light border border-slate/20 rounded-xl shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-slate/10">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-slate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy text-slate hover:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-navy text-slate hover:text-red-400 transition-colors"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>

      {showMobileMenu && (
        <div className="md:hidden border-t border-slate/10 p-4 bg-navy-light">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-navy border border-slate/20 rounded-xl text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 bg-navy rounded-lg text-sm text-slate hover:text-teal"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-navy-light border-t border-slate/10 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.slice(1, 6).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive ? "text-teal" : "text-slate"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="absolute bottom-16 left-0 right-0 z-40 md:hidden">
        <div className="flex items-center justify-center gap-2 p-2">
          <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-medium text-sm">7</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-slate mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-teal transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight className="w-4 h-4" />}
        </div>
      ))}
    </nav>
  );
}