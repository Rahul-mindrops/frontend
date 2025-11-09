"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Package, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventoryStats();
  }, []);

  const fetchInventoryStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      const products = response.data?.products || response.data || [];
      const productsArray = Array.isArray(products) ? products : [];

      const inStock = productsArray.filter((p: any) => {
        const stock = p.stock || p.quantity || 0;
        return stock > 10;
      }).length;

      const lowStock = productsArray.filter((p: any) => {
        const stock = p.stock || p.quantity || 0;
        return stock > 0 && stock <= 10;
      }).length;

      const outOfStock = productsArray.filter((p: any) => {
        const stock = p.stock || p.quantity || 0;
        return stock === 0;
      }).length;

      setStats({
        totalProducts: productsArray.length,
        inStock,
        lowStock,
        outOfStock,
      });
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Inventory Overview</h1>
        <p className="text-gray-400">Monitor your product inventory at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-xl border border-blue-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Products</p>
              <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
            </div>
            <Package className="text-blue-400 w-8 h-8" />
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-xl border border-green-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">In Stock</p>
              <p className="text-3xl font-bold text-white">{stats.inStock}</p>
            </div>
            <CheckCircle className="text-green-400 w-8 h-8" />
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 backdrop-blur-xl border border-yellow-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Low Stock</p>
              <p className="text-3xl font-bold text-white">{stats.lowStock}</p>
            </div>
            <TrendingDown className="text-yellow-400 w-8 h-8" />
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-xl border border-red-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Out of Stock</p>
              <p className="text-3xl font-bold text-white">{stats.outOfStock}</p>
            </div>
            <AlertTriangle className="text-red-400 w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/inventory/list">
          <div className="rounded-xl bg-black/40 backdrop-blur-xl border border-gray-800/50 p-6 hover:border-gray-700/50 transition-all duration-300 cursor-pointer">
            <h2 className="text-xl font-bold text-white mb-2">View Inventory List</h2>
            <p className="text-gray-400 mb-4">Browse all products and their stock levels</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              View List
            </Button>
          </div>
        </Link>

        <Link href="/admin/inventory/update">
          <div className="rounded-xl bg-black/40 backdrop-blur-xl border border-gray-800/50 p-6 hover:border-gray-700/50 transition-all duration-300 cursor-pointer">
            <h2 className="text-xl font-bold text-white mb-2">Update Inventory</h2>
            <p className="text-gray-400 mb-4">Bulk update stock levels for multiple products</p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Update Stock
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}

