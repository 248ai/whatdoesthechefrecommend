import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Simple admin credentials - in production, use a proper user store
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@248.ai";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "chefrecommends2024";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Simple credential check - replace with DB lookup in production
        if (
          credentials.email === ADMIN_EMAIL &&
          credentials.password === ADMIN_PASSWORD
        ) {
          return {
            id: "1",
            email: ADMIN_EMAIL,
            name: "Admin",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = request.nextUrl.pathname === "/admin/login";

      if (isAdminRoute && !isLoginPage) {
        return !!auth;
      }

      return true;
    },
  },
});
