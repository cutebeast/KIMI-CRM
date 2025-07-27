'use client'

import { useSession, signOut } from 'next-auth/react'

export default function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (session?.user) {
    return (
      <div>
        <span>Welcome, {session.user.name}</span>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    )
  }

  return <a href="/api/auth/signin">Sign In</a>
}
