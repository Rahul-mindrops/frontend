import "@/app/globals.css";
import { ContextDatastore } from "@/ContextData/ContextDatastore";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: " Demoniod",
  description: "Automotive Parts Platform",
  icons: { icon: "/logo.webp" },
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ContextDatastore>
            {children}
            <Toaster position="bottom-center" duration={2000} />
          </ContextDatastore>
        </ThemeProvider>
      </body>
    </html>
  );
}