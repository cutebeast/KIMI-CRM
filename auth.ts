//
// FILE: auth.ts (in the project root)
//
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

// No "export" and NO type annotation ": AuthOptions"
// We let TypeScript infer the type, which is the modern pattern.
export const { handlers, auth, signIn, signOut } = NextAuth({
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
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    }
  }
})
