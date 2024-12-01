import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { objectToQueryString } from '../utils';

interface SendOptions {
    method: string;
    path: string;
    data?: any;
    token?: string;
    formData?: FormData;
}

interface RequestOptions {
    path: string;
    params?: {};
    data?: any;
    token?: string;
    formData?: FormData;
}

interface GetCurrentUserOptions {
    context?: GetServerSidePropsContext;
}

class APIClient {
    private static clientInstance: APIClient | null = null;
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    public static getInstance(baseURL: string): APIClient {
        if (typeof window === 'undefined') {
            return new APIClient(baseURL);
        }

        if (!APIClient.clientInstance) {
            APIClient.clientInstance = new APIClient(baseURL);
        }
        return APIClient.clientInstance;
    }

    private async send({ method, path, data, token, formData }: SendOptions) {
        const headers: Record<string, string> = {
            'X-Client-Type': 'web',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (data && !formData) {
            headers['Content-Type'] = 'application/json';
        }

        const opts: RequestInit = {
            method,
            headers,
            ...(typeof window !== 'undefined' && { credentials: 'include' }),
        };

        if (formData) {
            opts.body = formData;
        } else if (data) {
            opts.body = JSON.stringify(data);
        }

        const url = `${this.baseURL}/${path}`;
        return fetch(url, opts);
    }

    async get(options: RequestOptions) {
        let { path } = options

        if (options.params) {
            path = path + '?' + objectToQueryString(options.params, { arrayFormat: 'comma' })
        }

        options = { ...options, path }

        return this.send({ method: 'GET', ...options });
    }

    async post(options: RequestOptions) {
        return this.send({ method: 'POST', ...options });
    }

    async put(options: RequestOptions) {
        return this.send({ method: 'PUT', ...options });
    }

    async delete(options: RequestOptions) {
        return this.send({ method: 'DELETE', ...options });
    }

    async getCurrentUser({ context }: GetCurrentUserOptions = {}) {
        let token: string | undefined;

        if (typeof window === 'undefined' && context) {
            const session = await getSession(context);
            token = session?.user?.token;
        }

        return this.get({ path: 'user', token }).then(res => {
            if (!res.ok) throw new Error('Failed to fetch user');
            return res.json();
        });
    }
}

const apiClient = APIClient.getInstance(process.env.BASE_URL_API || 'http://localhost:3000/api/')

export default apiClient