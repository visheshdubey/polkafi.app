/* -------------------------------------------------------------------------- */
/*                             Types & Interfaces                             */
/* -------------------------------------------------------------------------- */

interface RequestOptions {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    body?: string | FormData;
}

/* -------------------------------------------------------------------------- */
/*                                Base Function                               */
/* -------------------------------------------------------------------------- */
interface FetchDataParams {
    jwt?: string | null;
    url: string;
    options: RequestOptions;
    contentType?: string;
}

export const fetchOrMutateFn = async ({
    jwt,
    url,
    options,
    contentType = "application/json",
}: FetchDataParams) => {
    const response = await fetch(url, {
        headers: {
            "Content-Type": contentType,
            authorization: `Bearer ${jwt}`,
        },
        ...options,
    });

    if (!response.ok) {
        let errorMessage = "";
        let status = response.status;

        switch (status) {
            case 400:
                errorMessage = (await response.json()).message || "Bad request";
                throw { message: errorMessage, status };
            case 401:
                throw { message: "Unauthorized", status };
            case 403:
                throw { message: "Forbidden", status };
            case 404:
                throw { message: "Not found", status };
            case 500:
                throw { message: "Internal server error", status };
            default:
                throw { message: "Something went wrong", status };
        }
    }
    return response.json();
};