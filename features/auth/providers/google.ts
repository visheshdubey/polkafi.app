import GoogleProvider from "next-auth/providers/google";

export const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID || "1",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "2",
};

export const GoogleAuth = GoogleProvider(googleConfig);
