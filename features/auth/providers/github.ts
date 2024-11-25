import GithubProvider from "next-auth/providers/github";
export const githubConfig = {
    clientId: process.env.GITHUB_ID || "",
    clientSecret: process.env.GITHUB_SECRET || "",
};

export const GithubAuth = GithubProvider(githubConfig);
