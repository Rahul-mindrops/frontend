"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface StockUpdate {
  productId: string;
  productName: string;
  currentStock: number;
  newStock: number;
}

export default function UpdateInventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [updates, setUpdates] = useState<StockUpdate[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setFetching(true);
      const response = await api.get("/products");
      const productsData = response.data?.products || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setFetching(false);
    }
  };

  const addProductToUpdate = () => {
    setUpdates([
      ...updates,
      {
        productId: "",
        productName: "",
        currentStock: 0,
        newStock: 0,
      },
    ]);
  };

  const removeUpdate = (index: number) => {
    setUpdates(updates.filter((_, i) => i !== index));
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find((p) => p.id === parseInt(productId));
    if (product) {
      const newUpdates = [...updates];
      newUpdates[index] = {
        productId,
        productName: product.name || "",
        currentStock: product.stock || product.quantity || 0,
        newStock: product.stock || product.quantity || 0,
      };
      setUpdates(newUpdates);
    }
  };

  const handleStockChange = (index: number, value: string) => {
    const newUpdates = [...updates];
    newUpdates[index].newStock = parseInt(value) || 0;
    setUpdates(newUpdates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (updates.length === 0) {
      toast.error("Please add at least one product to update");
      return;
    }

    setLoading(true);

    try {
      // Update each product's stock
      await Promise.all(
        updates.map((update) =>
          api.put("/products", {
            id: parseInt(update.productId),
            stock: update.newStock,
            quantity: update.newStock,
          })
        )
      );

      toast.success("Inventory updated successfully");
      router.push("/admin/inventory/list");
    } catch (error: any) {
      console.error("Error updating inventory:", error);
      toast.error(error?.response?.data?.message || "Failed to update inventory");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/inventory/list">
          <Button variant="ghost" className="text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Update Inventory</h1>
        <p className="text-gray-400">Bulk update stock levels for multiple products</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-black/40 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Stock Updates</h2>
            <Button
              type="button"
              onClick={addProductToUpdate}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>

          {updates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No products added yet. Click "Add Product" to start.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-900 rounded-lg border border-gray-800"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-white font-medium">Product #{index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpdate(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white mb-2 block">Product</Label>
                      <Select
                        value={update.productId}
                        onValueChange={(value) => handleProductSelect(index, value)}
                        required
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name} (Current: {product.stock || product.quantity || 0})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">New Stock Level</Label>
                      <Input
                        type="number"
                        min="0"
                        value={update.newStock}
                        onChange={(e) => handleStockChange(index, e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        required
                      />
                      {update.currentStock !== undefined && (
                        <p className="text-gray-400 text-sm mt-1">
                          Current: {update.currentStock}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || updates.length === 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? "Updating..." : "Update Inventory"}
        </Button>
      </form>
    </div>
  );
}

