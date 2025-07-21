"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Clapperboard,
  Phone,
  Info,
  User,
  ChevronDown,
  HeartIcon,
  TicketIcon,
  Settings,
  Mail,
  Globe,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/AuthStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import api from "@/utils/apiFetch";
import AuthGuard from "../Auth/AuthGuard";
import toast from "react-hot-toast";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/films", label: "Catalog", icon: Clapperboard },
  { href: "/about", label: "About Us", icon: Info },
  { href: "/contact", label: "Contact", icon: Phone },
] as const;

export default function Header() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  type UserProfile = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/user/user-profile");
        console.log("User profile fetched:", response);
        setProfile(response);
        useAuthStore.getState().setProfile(response);
      } catch {
        console.error("User profile fetch error");
      }
    };
    fetchUserProfile();
  }, []);

  const router = useRouter();
  

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-10">
        {/* logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <Image
            width={40}
            height={40}
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
        <div className="hidden items-center gap-12 lg:flex">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
            <Input
              placeholder="Search in the catalog"
              className="h-9 rounded-full bg-white/10 pl-10 pr-12 placeholder:text-white/60"
            />
          </div> */}
          <AuthGuard>
            {isAuthenticated && profile && (
              <DropdownMenu>
                {/* ▸ le “bouton” qui ouvre le menu */}
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-full bg-[#E50914] px-3 hover:bg-red-700">
                    <User size={18} className="mr-2" />
                    {profile.firstName}
                    <ChevronDown size={18} />
                  </Button>
                </DropdownMenuTrigger>

                {/* ▸ le contenu du menu */}
                <DropdownMenuContent
                  align="end"
                  className="w-52 p-2 rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-md"
                >

                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex focus:bg-white/20 cursor-pointer w-full items-center gap-2">
                      <User size={14} /> Mon compte
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=favorites" className="flex focus:bg-white/20 cursor-pointer w-full items-center gap-2">
                      <HeartIcon size={14} /> Mes favoris
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=tickets" className="flex focus:bg-white/20 cursor-pointer w-full items-center gap-2">
                      <TicketIcon size={14} /> Mes tickets
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=preferences" className="flex focus:bg-white/20 cursor-pointer w-full items-center gap-2">
                      <Settings size={14} /> Mes preferences
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=contact" className="flex focus:bg-white/20 cursor-pointer w-full items-center gap-2">
                      <Mail size={14} /> Contact
                    </Link>
                  </DropdownMenuItem>

                  {/* Ajoute d’autres liens si besoin */}
                  {/* <DropdownMenuItem>Historique commandes</DropdownMenuItem> */}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onSelect={async () => {
                      try {
                        await api.post("/api/auth/logout", {});
                        useAuthStore.getState().setIsAuthenticated(false);
                        useAuthStore.getState().setProfile({ firstName: '', lastName: '', email: '', role: '' });
                        toast.success("Déconnexion réussie !", {
                          duration: 5000,
                          style: {
                            border: "1px solid #4ade80",
                            background: "#ecfdf5",
                            color: "#065f46",
                          },
                        });
                        router.push("/");
                      } catch {
                        toast.error("Erreur lors de la déconnexion", {
                          duration: 5000,
                          style: {
                            border: "1px solid #f87171",
                            background: "#fee2e2",
                            color: "#b91c1c",
                          },
                        });
                      }
                    }}
                    className="text-red-400 focus:bg-red-400/20 cursor-pointer"
                  >
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </AuthGuard>

          {!isAuthenticated && (
            <Link href="/auth/signin">
              <Button className="rounded-full bg-[#E50914] px-5 hover:bg-red-700">
                Sign in
              </Button>
            </Link>
          )}
          
          <Button variant="ghost" size="icon" className="hover:bg-white/10">
            <Globe size={18} />
            Français
          </Button>
        </div>
      </div>
    </header>
  );
}
