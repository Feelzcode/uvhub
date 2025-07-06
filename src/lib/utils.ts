import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateBreadcrumb(path: string) {
  const pathSegments = path.split('/').filter(Boolean)
  const breadcrumb = pathSegments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    url: `/${pathSegments.slice(0, index + 1).join('/')}`,
  }))
  return breadcrumb
}