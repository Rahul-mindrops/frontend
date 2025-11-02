"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { apiClient } from "@/utils/helper";
import { useContextData } from "@/ContextData/ContextDatastore";
import { Shield, ArrowLeft, Loader2 } from "lucide-react";

const Verify2FAPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const { setUser, setCheck, check } = useContextData();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!username) {
      toast.error("Invalid session. Please login again.");
      router.push("/auth/adminLogin");
      return;
    }
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, [username, router]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) {
      toast.error("Please paste only numbers");
      return;
    }

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    
    // Focus last filled input or last input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpToken = otp.join("");

    if (otpToken.length !== 6) {
      setError("Please enter complete 6-digit code");
      toast.error("Please enter complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient<{
        success: boolean;
        message?: string;
        admin: {
          username: string;
          role: string;
          email?: string;
        };
      }>("admin/verify-2fa", {
        method: "POST",
        body: {
          username,
          token: otpToken,
        },
      });

      if (response.success) {
        toast.success("2FA verified successfully!");
        // Set user based on project context pattern (admin.username or full admin object)
        const adminData = response.admin;
        setUser({
          id: adminData.username,
          email: adminData.email || `${adminData.username}@eventpro.com`,
          role: adminData.role,
          name: adminData.username,
        });
        setCheck(!check);
        
        // Redirect based on role
        if (adminData.role === "ADMIN" || adminData.role === "SUPER_ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      } else {
        setError(response.message || "Invalid OTP code");
        toast.error("Invalid OTP code");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      console.error("2FA Verification Error:", error);
      setError(error?.message || "Verification failed");
      toast.error("Verification failed. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/auth/adminLogin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url(/loginbg.jpeg)] px-4">
      <Card className="w-full max-w-md bg-black/90 border-zinc-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">
            Enter Verification Code
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter the 6-digit code from Google Authenticator
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP Input Fields */}
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold bg-zinc-900 border-zinc-700 text-white focus:border-blue-500"
                disabled={loading}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>

          {/* Back Button */}
          <Button
            onClick={handleBack}
            variant="outline"
            className="w-full border-zinc-700 text-gray-400 hover:bg-zinc-900"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>

          {/* Help Text */}
          <div className="text-center space-y-2">
            <p className="text-gray-500 text-sm">
              Open Google Authenticator app on your phone
            </p>
            <p className="text-gray-500 text-sm">
              Can't access your code?{" "}
              <button
                onClick={() => toast.info("Please contact administrator")}
                className="text-blue-500 hover:underline"
              >
                Get help
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify2FAPage;

