import { CHAINS } from '@/config/chians';
import { PUBLIC_NODES } from '@/config/node';
import { first } from 'lodash-es';

import { PublicClient, createPublicClient, fallback, http } from 'viem';
import { mainnet } from 'viem/chains';
// multicall config
export const CLIENT_CONFIG = {
    batch: {
        multicall: {
            batchSize: 1024 * 200,
            wait: 16,
        },
    },
    pollingInterval: 6_000,
};
export type CreateViemPublicClientParams = {
    transportSignal?: AbortSignal;
};
// ViemPublicClients
export function createViemPublicClients({ transportSignal }: CreateViemPublicClientParams = {}) {
    return CHAINS.reduce(
        (prev, cur) => {
            return {
                ...prev,
                [cur.id]: createPublicClient({
                    chain: cur,
                    transport: fallback(
                        PUBLIC_NODES[cur.id].map((t) =>
                            http(t, {
                                timeout: 10_000,
                                fetchOptions: {
                                    signal: transportSignal,
                                },
                            }),
                        ),
                        {
                            rank: false,
                        },
                    ),
                }),
            };
        },
        {} as Record<number, PublicClient>,
    );
}
export const viemClients = createViemPublicClients();
type CreateViemPublicClientGetterParams = {
    viemClients?: Record<number, PublicClient>;
} & CreateViemPublicClientParams;

// ViemPublicClientGetter
export function createViemPublicClientGetter({
    viemClients: viemClientsOverride,
    ...restParams
}: CreateViemPublicClientGetterParams = {}) {
    const clients = viemClientsOverride ?? createViemPublicClients(restParams);
    return function getClients({ chainId }: { chainId?: number }): PublicClient {
        return clients[chainId!];
    };
}
// getViemClients
export const getViemClients = createViemPublicClientGetter({ viemClients });
// const PUBLIC_MAINNET = 'https://ethereum.publicnode.com';

//
// export const publicClient = ({ chainId }: { chainId: number }) => {
//     if (chainId && viemClients[chainId]) {
//         return viemClients[chainId];
//     }
//     let httpString: string | undefined;
//     if (process.env.NODE_ENV === 'test' && chainId === mainnet.id) {
//         httpString = PUBLIC_MAINNET;
//     } else {
//         httpString = chainId && first(PUBLIC_NODES[chainId]) ? first(PUBLIC_NODES[chainId]) : undefined;
//     }
//     const chain = CHAINS.find((c) => c.id == chainId);
//     return createPublicClient({
//         chain,
//         transport: http(httpString),
//         ...CLIENT_CONFIG,
//     });
// };
