'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useEffect, useState } from 'react'

interface UserProfile {
  name: string
  email: string
  profile?: {
    loyaltyPoints: number
    tier: string
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetch(`/api/users/${session.user.id}`)
        .then(res => res.json())
        .then(setUser)
        .catch(console.error)
    }
  }, [status, session?.user?.id])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Loyalty Points:</strong> {user.profile?.loyaltyPoints}</p>
          <p><strong>Tier:</strong> {user.profile?.tier}</p>
        </CardContent>
      </Card>
    </div>
  )
}
