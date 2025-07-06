'use client'

import Image from "next/image";
import { GalleryVerticalEnd } from "lucide-react";
import { usePathname } from "next/navigation";

const images = [
    {
        page: 'sign-in',
        src: '/images/sign-in.jpg'
    },
    {
        page: 'forgot-password',    
        src: '/images/forgot-password.jpg'
    },
    {
        page: 'reset-password',
        src: '/images/reset-password.jpg'
    }
];

export default function GuestLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // use navigation to get the page
    const pathname = usePathname();
    const page = pathname.split('/').pop();

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        <h1 className="text-2xl font-bold">UV Hub</h1>
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        {children}
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src={images.find(image => image.page === page)?.src || ''}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                    fill
                />
            </div>
        </div>
    )
}