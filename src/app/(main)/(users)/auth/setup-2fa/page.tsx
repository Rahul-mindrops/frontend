"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/utils/helper";
import { Loader2, Shield, CheckCircle, Copy } from "lucide-react";

const Setup2FAPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) {
      toast.error("Invalid session. Please login again.");
      router.push("/auth/adminLogin");
      return;
    }

    // Fetch 2FA setup data from backend
    const fetchSetup2FA = async () => {
      try {
        setLoading(true);
        const response = await apiClient<{
          success: boolean;
          qrCode: string;
          secret: string;
          message?: string;
          otpauth_url?: string;
        }>("admin/setup-2fa", {
          method: "POST",
          body: { username },
        });

        if (response.success) {
          // Handle QR code - ensure it has data URI prefix if it's base64
          let formattedQrCode = response.qrCode || "";
          if (formattedQrCode && !formattedQrCode.startsWith("data:image")) {
            // If it's base64 without prefix, add it
            if (formattedQrCode.startsWith("iVBORw0KGgo") || formattedQrCode.startsWith("/9j/")) {
              formattedQrCode = `data:image/png;base64,${formattedQrCode}`;
            }
          }
          
          const formattedSecret = response.secret || "";
          
          if (!formattedQrCode && !formattedSecret) {
            setError("No QR code or secret received from server");
            toast.error("Failed to setup 2FA - missing data");
            return;
          }
          
          setQrCode(formattedQrCode);
          setSecret(formattedSecret);
        } else {
          setError(response.message || "Failed to generate 2FA setup");
          toast.error("Failed to setup 2FA");
        }
      } catch (error: any) {
        console.error("2FA Setup Error:", error);
        setError(error?.message || "Failed to setup 2FA");
        toast.error("Failed to setup 2FA");
      } finally {
        setLoading(false);
      }
    };

    fetchSetup2FA();
  }, [username, router]);

  const handleContinue = () => {
    // Redirect to OTP verification page
    router.push(`/auth/verify-2fa?username=${username}`);
  };

  const handleSkipForNow = () => {
    toast.info("You can setup 2FA later from settings");
    router.push("/admin/dashboard");
  };

  const handleCopySecret = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success("Secret copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy secret error:", error);
      toast.error("Failed to copy secret");
    }
  };

  // Format secret with spaces for better readability (every 4 characters)
  const formatSecretCode = (secretCode: string) => {
    if (!secretCode) return "";
    return secretCode.replace(/(.{4})/g, "$1 ").trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url(/loginbg.jpeg)]">
        <Card className="w-full max-w-md bg-black/90 border-zinc-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
            <p className="mt-4 text-gray-400">Setting up 2FA...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url(/loginbg.jpeg)] px-4">
        <Card className="w-full max-w-md bg-black/90 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-red-500">Setup Failed</CardTitle>
            <CardDescription className="text-gray-400">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/auth/adminLogin")}
              className="w-full bg-white text-black hover:bg-gray-200"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url(/loginbg.jpeg)] px-4 py-8">
      <Card className="w-full max-w-md bg-black/90 border-zinc-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">
            Setup Two-Factor Authentication
          </CardTitle>
          <CardDescription className="text-gray-400">
            Secure your account with Google Authenticator
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">
                1
              </div>
              <h3 className="text-white font-semibold">
                Download Google Authenticator
              </h3>
            </div>
            <p className="text-gray-400 text-sm ml-8">
              Install the Google Authenticator app on your mobile device from
              App Store or Google Play.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">
                2
              </div>
              <h3 className="text-white font-semibold">Scan QR Code</h3>
            </div>
            <p className="text-gray-400 text-sm ml-8">
              Open Google Authenticator and scan this QR code:
            </p>
            
            {qrCode ? (
              <div className="flex justify-center p-4 bg-white rounded-lg ml-8">
                <img
                  src={qrCode}
                  alt="2FA QR Code"
                  className="w-48 h-48 object-contain"
                  onError={(e) => {
                    console.error("QR code failed to load");
                    e.currentTarget.style.display = "none";
                    toast.error("QR code image failed to load. Please use manual entry.");
                  }}
                />
              </div>
            ) : (
              <div className="flex justify-center p-4 bg-zinc-900 rounded-lg ml-8 border border-zinc-700">
                <p className="text-gray-400 text-sm">QR code not available. Please use manual entry.</p>
              </div>
            )}
          </div>

          {/* Step 3 - Manual Entry */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">
                3
              </div>
              <h3 className="text-white font-semibold">
                Or Enter Code Manually
              </h3>
            </div>
            <p className="text-gray-400 text-sm ml-8">
              If you can't scan the QR code, enter this code manually:
            </p>
            {secret ? (
              <div className="ml-8 p-3 bg-zinc-900 rounded border border-zinc-700 relative group">
                <code className="text-green-400 text-sm break-all font-mono select-all">
                  {formatSecretCode(secret)}
                </code>
                <button
                  onClick={handleCopySecret}
                  className="absolute top-2 right-2 p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-600 transition-opacity opacity-0 group-hover:opacity-100"
                  title="Copy secret"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
                {copied && (
                  <div className="absolute top-2 right-2 p-1.5 bg-green-600 rounded">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-8 p-3 bg-zinc-900 rounded border border-zinc-700">
                <p className="text-gray-500 text-sm">Secret not available</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!qrCode && !secret}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              I've Scanned the QR Code
            </Button>
            
            <Button
              onClick={handleSkipForNow}
              variant="outline"
              className="w-full border-zinc-700 text-gray-400 hover:bg-zinc-900"
            >
              Skip for Now
            </Button>
          </div>

          {/* Warning */}
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <p className="text-yellow-500 text-xs">
              ⚠️ Keep this secret safe! You'll need it to access your account.
              Save it in a secure location.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setup2FAPage;

