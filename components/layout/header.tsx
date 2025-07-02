"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Clapperboard,
  Phone,
  Search,
  Globe,
  Info,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Main", icon: Home },
  { href: "/films", label: "Catalog", icon: Clapperboard },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
] as const;

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-10">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <img
            src="/KaguyaCine_logo.svg"
            alt="KaguyaCiné Logo"
            className="h-10 w-10 bg-[#E50914] rounded-md"
          />
          <span className="hidden md:inline text-xl font-light font-outfit text-white">
            .
          </span>
        </Link>

        {/* nav */}
        <NavigationMenu>
          <NavigationMenuList className="gap-4">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <NavigationMenuItem key={href} asChild>
                  <NavigationMenuLink asChild>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex flex-col items-center text-sm transition",
                        active
                          ? "text-[#E50914]"
                          : "hover:text-[#E50914] text-white/90"
                      )}
                    >
                      <Icon size={60} />
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* search + auth */}
        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
            <Input
              placeholder="Search in the catalog"
              className="h-9 rounded-full bg-white/10 pl-10 pr-12 placeholder:text-white/60"
            />
          </div>

          <Button className="rounded-full bg-[#E50914] px-5 hover:bg-red-700">
            Sign in
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-white/10">
            <Globe size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}
