"use client";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { LogOut, Calendar, Grid3x3, Package2, Users as UsersIcon, FileText, Newspaper, User, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.replace("/auth/login");
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900 font-semibold text-lg">EventPro Admin</span>
            </div>
            <SidebarTrigger className="text-gray-700 hover:bg-gray-100" />
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4">
            {/* MAIN MENU */}
            <div className="mb-8">
              <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-3">
                MAIN MENU
              </h3>
              <nav className="space-y-1">
                <Link
                  href="/admin"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive("/admin") || isActive("/admin/dashboard")
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/admin/categories"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive("/admin/categories")
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Event Directory</span>
                </Link>
                <Link
                  href="/admin/products"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive("/admin/products")
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Package2 className="w-5 h-5" />
                  <span>Event Packages</span>
                </Link>
                <Link
                  href="/admin/users"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive("/admin/users")
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <UsersIcon className="w-5 h-5" />
                  <span>Students</span>
                </Link>
                <Link
                  href="/admin/categories/fields"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive("/admin/categories/fields")
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <span>Fields Management</span>
                </Link>
                <Link
                  href="/admin/news"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive("/admin/news")
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Newspaper className="w-5 h-5" />
                  <span>News</span>
                </Link>
              </nav>
            </div>

            {/* ACCOUNT */}
            <div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4 px-3">
                ACCOUNT
              </h3>
              <nav className="space-y-1">
                <Link
                  href="/admin/profile"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive("/admin/profile")
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/admin/settings"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive("/admin/settings")
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-10 h-10 bg-blue-500">
                <AvatarFallback className="bg-blue-500 text-white">AD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-gray-900 font-medium text-sm">Admin User</p>
                <p className="text-gray-500 text-xs">admin@eventpro.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
