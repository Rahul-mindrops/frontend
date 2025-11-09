"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin", description: "Full system access" },
  { value: "ADMIN", label: "Admin", description: "Administrative access" },
  { value: "CONTENT_MGR", label: "Content Manager", description: "Manage content and products" },
  { value: "INVENTORY_MGR", label: "Inventory Manager", description: "Manage inventory and stock" },
  { value: "CUSTOMER", label: "Customer", description: "Standard customer access" },
  { value: "GUEST", label: "Guest", description: "Limited access" },
];

export default function UserRolesPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/users");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: number, newRole: string) => {
    try {
      await api.put("/auth/users", { id: userId, role: newRole });
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const getRoleInfo = (role: string) => {
    return ROLES.find((r) => r.value === role) || ROLES[ROLES.length - 1];
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/admin/settings">
          <Button variant="ghost" className="text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">User Roles Management</h1>
        <p className="text-gray-400">Manage user roles and permissions</p>
      </div>

      {/* Role Information */}
      <div className="mb-6 p-6 bg-black/40 backdrop-blur-xl border border-gray-800/50 rounded-xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Available Roles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((role) => (
            <div
              key={role.value}
              className="p-4 bg-gray-900 rounded-lg border border-gray-800"
            >
              <h3 className="text-white font-bold mb-1">{role.label}</h3>
              <p className="text-gray-400 text-sm">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/40 border-gray-800 text-white"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-black/40 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-900/50">
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Current Role</TableHead>
                <TableHead className="text-gray-300">Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const roleInfo = getRoleInfo(user.role || "CUSTOMER");
                  return (
                    <TableRow
                      key={user.id}
                      className="border-gray-800 hover:bg-gray-900/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {(user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.username || 'User'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400">{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">
                          {roleInfo.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <select
                          value={user.role || "CUSTOMER"}
                          onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                          className="bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

