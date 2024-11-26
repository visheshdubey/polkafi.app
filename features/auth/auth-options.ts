import { createUser, findUserByEmail } from "@/server/db/user/UserRepository";

import { GithubAuth } from "@/features/auth/providers/github";
import { GoogleAuth } from "@/features/auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [GoogleAuth, GithubAuth],
    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) {
                return false;
            }

            try {
                let dbUser = await findUserByEmail(user.email);

                if (!dbUser) {
                    dbUser = await createUser({
                        email: user.email,
                        provider: account?.provider,
                        avatar: user.image,
                        name: user.name,
                    });
                }

                return true;
            } catch (error) {
                console.error("SignIn Error:", error);
                return false;
            }
        },

        async jwt({ token, user, account, trigger, session }) {
            if (account && user) {
                token.id = user.id;
                token.provider = account.provider;

                return token;
            }

            if (trigger === "update" && session) {
                token = { ...token, ...session };

                return token;
            }

            if (!token.email) {
                return token;
            }

            const dbUser = await findUserByEmail(token.email);

            if (!dbUser) {
                return token;
            }

            return {
                ...token,
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                avatar: dbUser.avatar,
                providers: dbUser.provider,
            };
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.providers = token.providers;
                session.user.isAdmin = token.isAdmin;
                session.user.token = token;
            }

            return session;
        },
    },

    pages: {
        signIn: "/signin",
        error: "/auth/error",
    },

    debug: process.env.NODE_ENV === "development",
};

export default authOptions;
