"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function GeneralSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
  });

  useEffect(() => {
    // Load existing settings if available
    // This would typically come from an API endpoint
    // For now, we'll use placeholder values
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // This would typically save to an API endpoint
      // await api.put("/settings/general", formData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Settings saved successfully");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error?.response?.data?.message || "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/settings">
          <Button variant="ghost" className="text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">General Settings</h1>
        <p className="text-gray-400">Configure general application settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-black/40 backdrop-blur-xl border border-gray-800/50 rounded-xl p-6">
        <div>
          <Label htmlFor="siteName" className="text-white mb-2 block">
            Site Name
          </Label>
          <Input
            id="siteName"
            name="siteName"
            value={formData.siteName}
            onChange={handleChange}
            placeholder="Enter site name"
            className="bg-gray-900 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label htmlFor="siteDescription" className="text-white mb-2 block">
            Site Description
          </Label>
          <Textarea
            id="siteDescription"
            name="siteDescription"
            value={formData.siteDescription}
            onChange={handleChange}
            placeholder="Enter site description"
            className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactEmail" className="text-white mb-2 block">
              Contact Email
            </Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="contact@example.com"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="contactPhone" className="text-white mb-2 block">
              Contact Phone
            </Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="+91 1234567890"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address" className="text-white mb-2 block">
            Address
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter business address"
            className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}

