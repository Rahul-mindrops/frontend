"use client";

import Link from "next/link";
import { Settings, UserCog, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your application settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/settings/general">
          <div className="group rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 p-6 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="p-4 rounded-xl bg-blue-500/20 backdrop-blur-sm w-fit mb-4">
              <Globe className="text-blue-400 w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">General Settings</h2>
            <p className="text-gray-400">
              Configure general application settings, site information, and preferences
            </p>
          </div>
        </Link>

        <Link href="/admin/settings/user-roles">
          <div className="group rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="p-4 rounded-xl bg-purple-500/20 backdrop-blur-sm w-fit mb-4">
              <Shield className="text-purple-400 w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">User Roles</h2>
            <p className="text-gray-400">
              Manage user roles, permissions, and access controls
            </p>
          </div>
        </Link>

        <div className="group rounded-xl bg-gradient-to-br from-gray-500/20 to-gray-600/10 backdrop-blur-xl border border-gray-500/30 p-6 opacity-50">
          <div className="p-4 rounded-xl bg-gray-500/20 backdrop-blur-sm w-fit mb-4">
            <Settings className="text-gray-400 w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Advanced Settings</h2>
          <p className="text-gray-400">
            Coming soon - Advanced configuration options
          </p>
        </div>
      </div>
    </div>
  );
}

