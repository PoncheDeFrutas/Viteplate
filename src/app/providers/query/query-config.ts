import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

const IS_DEV = import.meta.env.DEV;

export interface QueryConfigOptions {
    queryCache?: QueryCache;
    mutationCache?: MutationCache;
}

function createDefaultQueryCache(): QueryCache {
    return new QueryCache({
        onError: (error, query) => {
            if (IS_DEV) {
                console.error(`[QueryCache] Error in query [${query.queryHash}]:`, error);
            }
        },
    });
}

function createDefaultMutationCache(): MutationCache {
    return new MutationCache({
        onError: (error, _variables, _context, mutation) => {
            if (IS_DEV) {
                const key = mutation.options.mutationKey ?? 'unknown';
                console.error(`[MutationCache] Error in mutation [${String(key)}]:`, error);
            }
        },
    });
}

export function createQueryClient(options?: QueryConfigOptions): QueryClient {
    return new QueryClient({
        queryCache: options?.queryCache ?? createDefaultQueryCache(),
        mutationCache: options?.mutationCache ?? createDefaultMutationCache(),
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60,
                gcTime: 1000 * 60 * 5,
                retry: 1,
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: false,
            },
        },
    });
}
