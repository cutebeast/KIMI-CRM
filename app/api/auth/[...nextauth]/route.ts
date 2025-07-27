//
// FILE: app/api/auth/[...nextauth]/route.ts
//
import { handlers } from "@/auth" // Assumes auth.ts is in the root
export const { GET, POST } = handlersimport NextAuth, { AuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const email = credentials.email as string
        const password = credentials.password as string
        
        const user = await prisma.user.findUnique({
          where: { email },
        })
        
        if (!user || !user.hashedPassword) {
          return null
        }
        
        const isValid = await bcrypt.compare(password, user.hashedPassword)
        
        if (!isValid) {
          return null
        }
        
        return user
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    signOut: "/logout"
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
