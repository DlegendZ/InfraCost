"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppLogo } from "@/components/icons/app-logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calculator, MessageSquare, Bot, DollarSign, HomeIcon, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const navItems = [
  { href: "/", label: "Calculator", icon: Calculator },
  { href: "/price-tracker", label: "Price Tracker", icon: DollarSign },
  { href: "/chatbot", label: "AI Chatbot", icon: Bot },
  { href: "/forum", label: "Forum", icon: MessageSquare },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="block group-data-[collapsible=icon]:hidden">
              <AppLogo />
            </Link>
            <div className="md:hidden">
               <SidebarTrigger />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, className:"bg-primary text-primary-foreground" }}
                    className="group-data-[collapsible=icon]:justify-center"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center justify-start gap-2 w-full px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://picsum.photos/100/100" alt="User Avatar" data-ai-hint="user avatar" />
                  <AvatarFallback>IC</AvatarFallback>
                </Avatar>
                <span className="group-data-[collapsible=icon]:hidden font-medium">User Name</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HomeIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 md:h-16">
          <div className="hidden md:block">
            <SidebarTrigger />
          </div>
          <h1 className="text-lg font-semibold md:text-xl">
            {navItems.find(item => item.href === pathname)?.label || "InfraCost"}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
