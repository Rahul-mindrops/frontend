import { Suspense } from "react";
import AdminInstallations from "@/components/AdminInstallations";
import { baseUrl } from "@/utils/config";

async function getInstallations(searchQuery: string = "", page: number = 1) {
  try {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    params.append("page", page.toString());
    params.append("limit", "10");

    const response = await fetch(`${baseUrl}/api/installation?${params.toString()}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch installations");
    }

    const data = await response.json();

    return {
      installations: data?.data || data || [],
      meta: data?.meta || {
        total: data?.data?.length || 0,
        page: page,
        limit: 10,
        totalPages: 1,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching installations:", error);
    return {
      installations: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      error: "Failed to load installations",
    };
  }
}

export default async function HomeInstallationPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const searchQuery = searchParams?.q || "";
  const page = parseInt(searchParams?.page || "1");

  const { installations, meta, error } = await getInstallations(searchQuery, page);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div></div>}>
      <AdminInstallations
        installations={installations}
        meta={meta}
        searchQuery={searchQuery}
        status="all"
        error={error || undefined}
      />
    </Suspense>
  );
}

