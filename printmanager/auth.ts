import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import {getLoggedUser} from "./lib/credentiallogins"
import { User } from "./types/types"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [ Google({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
  }), Credentials({
    credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" },
    },
    async authorize(credentials, request) {
       try {
        console.log(credentials, "credentials")
        const user = await getLoggedUser(credentials.email as String, credentials.password as String)
        if (!user.error) {
            user.id = user._id.toString()
            console.log("user", user)
            return user 
        } else {
            return null
        }
       } catch (error) {
        console.log("error", error)
       }
    },
  })],
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  callbacks: {
    async jwt({ token, user  }) {
        if (user) {
            token.id = user.id
            token.role = (user as User).role
        }
        return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      return session
    },
  }
})