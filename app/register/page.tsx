'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      if (response.ok) {
        router.push('/login')
      } else {
        const data = await response.json()
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      setError('Registration failed')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="mx-auto max-w-sm space-y-6 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}
