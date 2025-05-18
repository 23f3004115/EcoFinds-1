'use client';
import Link from 'next/link';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  Settings,
  PlusCircle,
  ListOrdered,
  UserCircle,
  ShoppingBag,
  Heart,
  History,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Header } from '@/components/shared/header';
import { EcoSwapLogo } from '@/components/icons/logo';
import { usePathname } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace('/login');
      } else {
        setIsLoadingUser(false);
      }
    };
    checkAuth();
  }, [router]);


  const navItems = [
    { href: '/products', label: 'Browse Products', icon: Home },
    { href: '/my-listings', label: 'My Listings', icon: ListOrdered },
    { href: '/products/new', label: 'Add Product', icon: PlusCircle },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, badge: '3' }, // Example badge
    { href: '/purchases', label: 'My Purchases', icon: History },
    { href: '/profile', label: 'Profile', icon: UserCircle },
  ];

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen w-full">
        <div className="hidden md:block border-r bg-sidebar w-64 p-4 space-y-4">
            <Skeleton className="h-10 w-32 mb-4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full mt-auto" />
        </div>
        <div className="flex flex-col flex-1">
            <div className="flex h-16 items-center border-b px-6">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-48 ml-auto"/>
            </div>
            <main className="flex-1 p-6">
                <Skeleton className="h-64 w-full" />
            </main>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
        <SidebarHeader className="p-4 flex items-center">
         <Link href="/products" className="flex items-center gap-2">
            <EcoSwapLogo className="h-8 w-auto hidden group-data-[state=expanded]:block"/>
             <ShoppingBag className="h-8 w-8 text-primary group-data-[state=expanded]:hidden" />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/products" && pathname.startsWith(item.href))}
                  tooltip={{children: item.label, side: 'right', align: 'center'}}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        {/* <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{children: "Settings", side: 'right', align: 'center'}}>
                <Link href="#">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter> */}
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
