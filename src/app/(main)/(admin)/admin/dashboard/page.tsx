"use client";

import { ShoppingCart, Users, Package, DollarSign, TrendingUp, ArrowRight, Activity, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  productsInStock: number;
  recentOrders: any[];
  recentUsers: any[];
  salesData: { date: string; sales: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    productsInStock: 0,
    recentOrders: [],
    recentUsers: [],
    salesData: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch all data in parallel
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        api.get("/orders").catch(() => ({ data: { orders: [] } })),
        api.get("/auth/users").catch(() => ({ data: [] })),
        api.get("/products").catch(() => ({ data: { products: [] } })),
      ]);

      const orders = ordersRes.data?.orders || ordersRes.data || [];
      const users = usersRes.data || [];
      const products = productsRes.data?.products || productsRes.data || [];

      // Calculate total sales
      const totalSales = Array.isArray(orders)
        ? orders.reduce((sum: number, order: any) => {
            const amount = typeof order.total === 'number' ? order.total : 
                          typeof order.amount === 'number' ? order.amount : 0;
            return sum + amount;
          }, 0)
        : 0;

      // Get recent orders (last 5)
      const recentOrders = Array.isArray(orders)
        ? orders
            .sort((a: any, b: any) => {
              const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
              const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
              return dateB - dateA;
            })
            .slice(0, 5)
        : [];

      // Get recent users (last 5)
      const recentUsers = Array.isArray(users)
        ? users
            .sort((a: any, b: any) => {
              const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
              const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
              return dateB - dateA;
            })
            .slice(0, 5)
        : [];

      // Generate sales data for chart (last 7 days)
      const salesData = Array.isArray(orders)
        ? (() => {
            const last7Days = Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              return date.toISOString().split('T')[0];
            });

            return last7Days.map((date) => {
              const dayOrders = orders.filter((order: any) => {
                const orderDate = order.createdAt || order.created_at;
                if (!orderDate) return false;
                return orderDate.split('T')[0] === date;
              });

              const daySales = dayOrders.reduce((sum: number, order: any) => {
                const amount = typeof order.total === 'number' ? order.total : 
                              typeof order.amount === 'number' ? order.amount : 0;
                return sum + amount;
              }, 0);

              return {
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                sales: daySales,
              };
            });
          })()
        : [];

      setStats({
        totalSales,
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        totalCustomers: Array.isArray(users) ? users.length : 0,
        productsInStock: Array.isArray(products) ? products.length : 0,
        recentOrders,
        recentUsers,
        salesData,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const AnimatedNumber = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      let startTime: number;
      const startValue = 0;
      const endValue = value;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const current = startValue + (endValue - startValue) * progress;
        setDisplayValue(Math.floor(current));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
        }
      };

      requestAnimationFrame(animate);
    }, [value, duration]);

    return <span>{displayValue.toLocaleString()}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
        </div>
        <Button
          onClick={fetchDashboardData}
          disabled={refreshing}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </header>

      {/* Metrics Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
        {/* Total Sales */}
        <Link href="/admin/orders/list">
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 p-6 hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Sales</p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(stats.totalSales)}
              </p>
              <div className="flex items-center mt-2 text-green-400 text-xs">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span>+12.5% from last month</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/20 backdrop-blur-sm">
              <DollarSign className="text-blue-400 w-8 h-8" />
            </div>
          </div>
        </div>
        </Link>

        {/* Total Orders */}
        <Link href="/admin/orders/list">
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl border border-green-500/30 p-6 hover:border-green-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:scale-105 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-white">
                <AnimatedNumber value={stats.totalOrders} />
              </p>
              <div className="flex items-center mt-2 text-green-400 text-xs">
                <Activity className="w-3 h-3 mr-1" />
                <span>Active orders</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-green-500/20 backdrop-blur-sm">
              <ShoppingCart className="text-green-400 w-8 h-8" />
            </div>
          </div>
        </div>
        </Link>

        {/* Total Customers */}
        <Link href="/admin/users">
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-xl border border-yellow-500/30 p-6 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20 hover:scale-105 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-white">
                <AnimatedNumber value={stats.totalCustomers} />
              </p>
              <div className="flex items-center mt-2 text-blue-400 text-xs">
                <Users className="w-3 h-3 mr-1" />
                <span>Registered users</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-yellow-500/20 backdrop-blur-sm">
              <Users className="text-yellow-400 w-8 h-8" />
            </div>
          </div>
        </div>
        </Link>

        {/* Products in Stock */}
        <Link href="/admin/products">
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Products in Stock</p>
              <p className="text-3xl font-bold text-white">
                <AnimatedNumber value={stats.productsInStock} />
              </p>
              <div className="flex items-center mt-2 text-purple-400 text-xs">
                <Package className="w-3 h-3 mr-1" />
                <span>Available items</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/20 backdrop-blur-sm">
              <Package className="text-purple-400 w-8 h-8" />
            </div>
          </div>
        </div>
        </Link>
      </section>

      {/* Quick Actions & Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
        {/* Sales Chart */}
        <div className="lg:col-span-2 rounded-xl bg-black/40 backdrop-blur-xl border border-gray-800/50 p-6 hover:border-gray-700/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Sales Overview</h2>
            <Link href="/admin/orders/list">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorSales)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-500/30 p-6 hover:border-blue-400/50 transition-all duration-300">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/admin/users">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 text-white justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Manage Products
                </Button>
              </Link>
              <Link href="/admin/orders/list">
                <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 text-white justify-start">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 text-white justify-start">
                  <Package className="w-4 h-4 mr-2" />
                  Manage Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Recent Orders */}
        <div className="rounded-xl bg-black/40 backdrop-blur-xl border border-gray-800/50 p-6 hover:border-gray-700/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <Link href="/admin/orders/list">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order: any, index: number) => (
                <Link key={index} href="/admin/orders/list">
                <div
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <div>
                    <p className="text-white font-medium">
                      Order #{order.id || order.orderId || `ORD-${index + 1}`}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {order.customerName || order.user?.firstName || 'Customer'} • {new Date(order.createdAt || order.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">
                      {formatCurrency(order.total || order.amount || 0)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'completed' || order.status === 'COMPLETED'
                        ? 'bg-green-500/20 text-green-400'
                        : order.status === 'pending' || order.status === 'PENDING'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status || 'Processing'}
                    </span>
                  </div>
                </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="rounded-xl bg-black/40 backdrop-blur-xl border border-gray-800/50 p-6 hover:border-gray-700/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Users</h2>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user: any, index: number) => (
                <Link key={index} href="/admin/users">
                <div
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {(user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : user.username || user.email || 'User'}
                      </p>
                      <p className="text-gray-400 text-sm">{user.email || 'No email'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'ADMIN' || user.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role || 'CUSTOMER'}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(user.createdAt || user.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent users</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
