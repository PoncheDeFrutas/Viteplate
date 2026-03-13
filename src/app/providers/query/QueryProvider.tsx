import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { createQueryClient } from './query-config';
import type { QueryConfigOptions } from './query-config';

const IS_DEV = import.meta.env.DEV;

interface QueryProviderProps {
    children: ReactNode;
    options?: QueryConfigOptions;
}

const defaultClient = createQueryClient();

export function QueryProvider({ children, options }: QueryProviderProps) {
    const client = options ? createQueryClient(options) : defaultClient;

    return (
        <QueryClientProvider client={client}>
            {children}
            {IS_DEV && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />}
        </QueryClientProvider>
    );
}
