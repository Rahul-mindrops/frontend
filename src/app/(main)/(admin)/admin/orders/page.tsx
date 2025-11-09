"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/orders/list");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
    </div>
  );
}
