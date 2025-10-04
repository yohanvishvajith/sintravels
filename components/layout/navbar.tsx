"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Mail } from "lucide-react";
import Image from "next/image";
import SignIn from "@/components/auth/sign-in";
import SignUp from "@/components/auth/sign-up";

export function Navbar() {
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [authUser, setAuthUser] = useState<any | null>(null);

  // don't render the site navbar inside admin routes (both /admin and /{locale}/admin)
  const isAdminPath = (() => {
    if (!pathname) return false;
    const parts = pathname.split("/").filter(Boolean);
    // parts[0] === 'admin' -> /admin
    // parts[1] === 'admin' -> /{locale}/admin
    return parts[0] === "admin" || parts[1] === "admin";
  })();

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("user");
        setAuthUser(raw ? JSON.parse(raw) : null);
      } catch (e) {
        setAuthUser(null);
      }
    };
    load();
    const handler = () => load();
    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("jobs"), href: "/jobs" },
    { name: t("services"), href: "/services" },
    { name: t("about"), href: "/about" },
    { name: t("contact"), href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    // hide navbar on admin sections
    !isAdminPath && (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/*  Navigation */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/img_logo.jpeg"
                alt="SIN Travels & Manpower Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-gray-900">
                SIN Travels & Manpower
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors duration-200 font-medium ${
                    isActive(item.href)
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button asChild>
                <Link href="/jobs">{t("searchjobs")}</Link>
              </Button>
              <div className="flex items-center space-x-2">
                {authUser ? (
                  <></>
                ) : (
                  <div className="flex items-center space-x-2">
                    <SignIn />
                    <SignUp />
                  </div>
                )}
              </div>
            </div>
            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-blue-600 bg-blue-50 px-3 py-2 rounded-md"
                          : "text-gray-700 hover:text-blue-600"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 border-t flex flex-col space-y-2">
                    <Button asChild>
                      <Link href="/jobs">Find Jobs</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    )
  );
}
