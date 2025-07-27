import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true }
  })

  if (!user) {
    throw new Error('User not found')
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Loyalty Points: {user.profile?.loyaltyPoints}</p>
      <p>Tier: {user.profile?.tier}</p>
    </div>
  )
}
