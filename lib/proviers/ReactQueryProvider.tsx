// "use client";

// import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { ReactNode } from "react";

// type Props = {
//     children: ReactNode;
// };

// const queryClient = new QueryClient({
//     mutationCache: new MutationCache({
//         onSuccess: (_data, _variables, _context, mutation) => {
//             queryClient.invalidateQueries({
//                 queryKey: mutation.options.mutationKey,
//             });
//         },
//     }),
//     defaultOptions: {
//         queries: {
//             retry: 0,
//             staleTime: 1000 * 60, // 30seconds
//             refetchOnMount: "always",
//             refetchOnWindowFocus: "always",
//             refetchOnReconnect: "always",
//             refetchInterval: 1000 * 30, //30 seconds
//             refetchIntervalInBackground: false,
//         },
//         mutations: {
//             retry: 0,
//         },
//     },
// });
// const ReactQueryProvider = (props: Props) => {
//     return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
// };

// export default ReactQueryProvider;
