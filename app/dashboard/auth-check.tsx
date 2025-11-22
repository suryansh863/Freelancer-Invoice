'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user')
    
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/auth/login')
    }
  }, [router])

  return <>{children}</>
}
