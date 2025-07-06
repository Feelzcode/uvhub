'use client'

import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { generateBreadcrumb } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname()
    const breadcrumbs = generateBreadcrumb(pathname)

    return (
        <ProtectedRoute>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb className="hidden md:block">
                                <BreadcrumbList>
                                    {breadcrumbs.map((item, index) => (
                                        <BreadcrumbItem key={index}>
                                            <BreadcrumbLink href={item.url}>{item.label}</BreadcrumbLink>
                                            {index < breadcrumbs.length - 1 && (
                                                <BreadcrumbSeparator className="hidden md:block" />
                                            )}
                                        </BreadcrumbItem>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ProtectedRoute>
    )
}