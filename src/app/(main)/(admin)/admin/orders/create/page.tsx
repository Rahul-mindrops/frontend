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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    userId: "",
    productId: "",
    quantity: 1,
    status: "pending",
    total: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      const productsData = response.data?.products || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/auth/users");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const selectedProduct = products.find((p) => p.id === parseInt(formData.productId));

  useEffect(() => {
    if (selectedProduct) {
      const price = selectedProduct.salePrice || selectedProduct.basePrice || 0;
      setFormData((prev) => ({
        ...prev,
        total: price * formData.quantity,
      }));
    }
  }, [formData.productId, formData.quantity, selectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/orders", {
        userId: parseInt(formData.userId),
        items: [
          {
            productId: parseInt(formData.productId),
            quantity: parseInt(formData.quantity.toString()),
            price: selectedProduct?.salePrice || selectedProduct?.basePrice || 0,
          },
        ],
        status: formData.status,
        total: formData.total,
      });

      toast.success("Order created successfully");
      router.push("/admin/orders/list");
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error?.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/orders/list">
          <Button variant="ghost" className="text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Create New Order</h1>
        <p className="text-gray-400">Create a new order manually</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-black/40 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6">
        <div>
          <Label htmlFor="userId" className="text-white mb-2 block">
            Customer
          </Label>
          <Select
            value={formData.userId}
            onValueChange={(value) => setFormData({ ...formData, userId: value })}
            required
          >
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="productId" className="text-white mb-2 block">
            Product
          </Label>
          <Select
            value={formData.productId}
            onValueChange={(value) => setFormData({ ...formData, productId: value })}
            required
          >
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.name} - ₹{product.salePrice || product.basePrice || 0}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="quantity" className="text-white mb-2 block">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
            }
            className="bg-gray-900 border-gray-700 text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="status" className="text-white mb-2 block">
            Status
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Amount:</span>
            <span className="text-2xl font-bold text-white">
              ₹{formData.total.toLocaleString()}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? "Creating..." : "Create Order"}
        </Button>
      </form>
    </div>
  );
}

