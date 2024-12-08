import { isEmpty } from "lodash";

export const isUserUnauthorized = (userId: string) => isEmpty(userId);

export const unauthorized = new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
});

export const forbidden = new Response(JSON.stringify({ error: "Forbidden" }), {
    status: 403,
});

export const internalServerError = new Response(JSON.stringify({ error: "Something went wrong!" }), {
    status: 500,
});
