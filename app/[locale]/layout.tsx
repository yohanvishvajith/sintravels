import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import MaybeFooter from "@/components/layout/maybe-footer";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import WhatsappWrapper from "@/components/home/whatsapp-wrapper";
import VisitorTracker from "@/components/visitor-tracker";

import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIN Manpower - Leading Job Placement Agency",
  description:
    "Connect with top employers worldwide. Expert job placement services across multiple industries and countries.",
  keywords:
    "job placement, recruitment, career opportunities, international jobs, manpower agency",
  openGraph: {
    title: "SIN Manpower - Leading Job Placement Agency",
    description:
      "Connect with top employers worldwide. Expert job placement services across multiple industries and countries.",
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html>
      <body className={inter.className}>
        <NextIntlClientProvider>
          <QueryProvider>
            <VisitorTracker />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <MaybeFooter />
            </div>
            <WhatsappWrapper />
            <Toaster />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
