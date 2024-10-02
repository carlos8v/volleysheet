import type { GetServerSidePropsContext } from "next";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db, eq } from "@volleysheet/db";
import * as schema from "@volleysheet/db/schema";

import { env } from "./env.mjs";

export type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      type: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        return {
          ...user,
          ...token,
        };
      }

      return token;
    },
    session({ session, token }) {
      if (token?.id && typeof token.id === "string") {
        return {
          ...session,
          user: {
            ...token,
          },
        };
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: "/auth/signin",
  },
  secret: env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: 60 * 60 * 24, // 1day
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          throw new Error("Payload inválido");
        }

        const [user] = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.type, "ADMIN"))
          .limit(1);

        if (!user?.id) {
          throw new Error("Usuário não encontrado");
        }

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (validPassword) {
          return {
            id: user.id,
            type: user.type,
          };
        }

        throw new Error("Senha inválida");
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
