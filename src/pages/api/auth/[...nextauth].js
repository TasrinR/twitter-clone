import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const user = credentials;

        if (user) {
          return {
            email: user.email,
            userId: user.id,
            accessToken: user.accessToken,
          };
        } else {
          return null;
        }
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token, params }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.userId;
        token.accessToken = user?.accessToken || "";
        token.email = user.email;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
export default NextAuth(authOptions);
