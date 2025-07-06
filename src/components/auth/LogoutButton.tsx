'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { logout } from '@/app/admin/dashboard/actions'

export default function LogoutButton() {
  return (
    <form action={logout}>
      <Button 
        type="submit" 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2 w-full cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </form>
  )
} 