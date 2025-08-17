import { Category } from "@/store/types"
import { useCategoriesStore } from "@/store/slices/categoriesSlice"
import { createClient } from "@/utils/supabase/client"
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

export function getPublicUrlOfUploadedFile(objectName: string) {
  const supabase = createClient();
  const { data } = supabase.storage.from('file-bucket').getPublicUrl(objectName);
  return data.publicUrl;
}

export function deleteFileFromStorage(publicUrl: string) {
  const supabase = createClient();
  // check if the file is in a folder, if it is delete it from the folder
  const folder = publicUrl.split('/').slice(3, -1).join('/');
  const objectName = publicUrl.split('/').pop();
  if (!objectName) {
    throw new Error('Invalid public URL');
  }
  supabase.storage.from('file-bucket').remove([folder, objectName]);
}

export const getCategoryName = (categoryIdOrObj: string | Category | undefined) => {
  if (!categoryIdOrObj) return '';
  if (typeof categoryIdOrObj === 'object') return categoryIdOrObj.name || '';
  return useCategoriesStore.getState().categories.find((cat: Category) => cat.id === categoryIdOrObj)?.name || categoryIdOrObj;
};