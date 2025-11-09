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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InventoryListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStock, setFilterStock] = useState<string>("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      const productsData = response.data?.products || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-400", bg: "bg-red-500/20" };
    if (stock <= 10) return { label: "Low Stock", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    return { label: "In Stock", color: "text-green-400", bg: "bg-green-500/20" };
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id?.toString().includes(searchQuery);
    
    const stock = product.stock || product.quantity || 0;
    const matchesFilter =
      filterStock === "all" ||
      (filterStock === "inStock" && stock > 10) ||
      (filterStock === "lowStock" && stock > 0 && stock <= 10) ||
      (filterStock === "outOfStock" && stock === 0);
    
    return matchesSearch && matchesFilter;
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventory List</h1>
          <p className="text-gray-400">Manage product stock levels</p>
        </div>
        <Button
          onClick={fetchProducts}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/40 border-gray-800 text-white"
          />
        </div>
        <Select value={filterStock} onValueChange={setFilterStock}>
          <SelectTrigger className="w-[180px] bg-black/40 border-gray-800 text-white">
            <SelectValue placeholder="Filter by stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Levels</SelectItem>
            <SelectItem value="inStock">In Stock</SelectItem>
            <SelectItem value="lowStock">Low Stock</SelectItem>
            <SelectItem value="outOfStock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="bg-black/40 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-900/50">
                <TableHead className="text-gray-300">Product ID</TableHead>
                <TableHead className="text-gray-300">Product Name</TableHead>
                <TableHead className="text-gray-300">Category</TableHead>
                <TableHead className="text-gray-300">Current Stock</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const stock = product.stock || product.quantity || 0;
                  const status = getStockStatus(stock);
                  return (
                    <TableRow
                      key={product.id}
                      className="border-gray-800 hover:bg-gray-900/50"
                    >
                      <TableCell className="text-white font-medium">
                        #{product.id}
                      </TableCell>
                      <TableCell className="text-white">{product.name || 'N/A'}</TableCell>
                      <TableCell className="text-gray-400">
                        {product.category?.name || product.categoryName || 'N/A'}
                      </TableCell>
                      <TableCell className="text-white font-bold">{stock}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                        {stock <= 10 && stock > 0 && (
                          <AlertTriangle className="inline-block w-4 h-4 text-yellow-400 ml-2" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    No products found
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

