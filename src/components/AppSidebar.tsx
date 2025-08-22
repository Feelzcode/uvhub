"use client"

import * as React from "react"
import {
    Command,
    LifeBuoy,
    Send,
    ShoppingBag,
    ShoppingCart,
    Settings,
    Facebook,
    Package,
} from "lucide-react"

import { NavMain } from "@/components/NavMain"
import { NavSecondary } from "@/components/NavSecondary"
import { NavUser } from "@/components/NavUser"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "Products",
            url: "/admin/dashboard/products",
            icon: ShoppingCart,
        },
        {
            title: "Variants",
            url: "/admin/dashboard/variants",
            icon: Package,
        },
        {
            title: "Orders",
            url: "/admin/dashboard/orders",
            icon: ShoppingBag,
        },
        {
            title: "Settings",
            url: "/admin/dashboard/settings",
            icon: Settings,
        },
        {
            title: "Facebook Pixel",
            url: "/admin/dashboard/setup-facebook-pixel",
            icon: Facebook,
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {


    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">UV Hub</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
