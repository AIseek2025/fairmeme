import { ChainsType } from '@/types/common';
import { useWebSocket } from 'ahooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export enum ActionType {
    swap = 'swap',
    watch = 'watch',
    hold = 'hold',
    other = 'other_action',
}

interface SwapPayload {
    tokenAddress: string;
    chainName: ChainsType;
    isBuy: boolean;
    amount: number;
    requestID: string;
}
interface WatchPayload {
    creatorAddress: string;
    // chainName: ChainsType;
}
interface HoldPayload {
    creatorAddress: string;
    // chainName: ChainsType;
}

interface OtherActionPayload {
    someField: string;
}

type PayloadMap = {
    swap: SwapPayload;
    watch: WatchPayload;
    hold: HoldPayload;
    other_action: OtherActionPayload;
};

interface SwapUpdateData {
    tokenAddress: string;
    tokenPrice: string;
    nativeTokenPrice: string;
    tokenAmount: string;
    nativeAmount: string;
    nativeReserve: string;
    tokenReserve: string;
    exchangeRate: string;
    requestID: string;
}

export interface WatchUpdateData {
    tokenAddress: string;
    tokenName: string;
    tokenLogo: string;
    tokenPrice: string;
    tokenTicker: string;
    tokenBalance: string;
    vol24: string;
    priceChangePct: string;
    followed: boolean;
    defaultFollowed: boolean;
}

export interface HoldUpdateData {
    followed: boolean;
    creatorAddress: string;
    priceChangePct: string;
    tokenAddress: string;
    tokenBalance: string;
    tokenLogo: string;
    tokenName: string;
    tokenPrice: string;
    tokenTicker: string;
    tokenUsdPrice: string;
}

interface OtherActionUpdateData {
    someField: string;
}

type ResponseMap = {
    swap: {
        response_type: 'swap_update';
        data: SwapUpdateData;
    };
    watch: {
        response_type: 'watch_update';
        data: WatchUpdateData[];
    };
    hold: {
        response_type: 'hold_update';
        data: HoldUpdateData[];
    };
    other_action: {
        response_type: 'other_action_update';
        data: OtherActionUpdateData;
    };
};

type WebSocketMessage<T extends ActionType> = {
    action: T;
    payload: PayloadMap[T];
};

export type WebSocketResponse<T extends ActionType> = ResponseMap[T];

interface UseCustomWebSocketOptions {
    manual?: boolean;
    reconnectLimit?: number;
    reconnectInterval?: number;
    onOpen?: (event: WebSocketEventMap['open']) => void;
    onClose?: (event: WebSocketEventMap['close']) => void;
    onMessage?: <T extends ActionType>(message: WebSocketResponse<T>, event: WebSocketEventMap['message']) => void;
    onError?: (event: WebSocketEventMap['error']) => void;
}

const DEFAULT_WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'wss://fairmeme.io/api/v1/ws';

const useWsHub = <T extends ActionType = ActionType>(
    options: UseCustomWebSocketOptions = {},
    socketUrl: string = DEFAULT_WS_URL,
) => {
    const {
        manual = false,
        reconnectLimit = 3,
        reconnectInterval = 3000,
        onOpen,
        onClose,
        onMessage,
        onError,
    } = options;

    const onMessageRef = useRef(onMessage);
    onMessageRef.current = onMessage;
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = useRef(reconnectLimit);
    const retryIntervalRef = useRef(reconnectInterval);
    const reconnectRef = useRef<(() => void) | null>(null);

    const [latestMessage, setLatestMessage] = useState<WebSocketResponse<T> | null>(null);

    const {
        readyState,
        sendMessage: sendRawMessage,
        disconnect,
        connect,
        webSocketIns,
    } = useWebSocket(socketUrl, {
        manual,
        reconnectLimit: 0,
        reconnectInterval,
        onOpen: (event) => {
            setRetryCount(0);
            onOpen?.(event);
        },
        onClose: (event) => {
            onClose?.(event);
            reconnectRef.current?.();
        },
        onMessage: (event) => {
            try {
                const message = JSON.parse(event.data) as WebSocketResponse<T>;
                setLatestMessage(message);
                onMessageRef.current?.(message, event);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        },
        onError,
    });

    reconnectRef.current = useCallback(() => {
        if (retryCount < maxRetries.current) {
            // console.log(`Attempt to reconnect... ( ${retryCount + 1} )`);
            setTimeout(
                () => {
                    setRetryCount((prevCount) => prevCount + 1);
                    connect();
                },
                retryIntervalRef.current * Math.pow(2, retryCount),
            );
        } else {
            console.error('The maximum number of retries was reached. Procedure Unable to reconnect');
        }
    }, [retryCount, connect]);

    const sendMessage = useCallback(
        (message: WebSocketMessage<T>) => {
            sendRawMessage(JSON.stringify(message));
        },
        [sendRawMessage],
    );

    const connectionStatus = useMemo(() => {
        switch (readyState) {
            case WebSocket.CONNECTING:
                return 'connecting';
            case WebSocket.OPEN:
                return 'connected';
            case WebSocket.CLOSING:
                return 'closing';
            case WebSocket.CLOSED:
                return 'closed';
            default:
                return 'unknown';
        }
    }, [readyState]);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        connectionStatus,
        sendMessage,
        disconnect,
        connect,
        latestMessage,
        webSocketIns,
        retryCount,
    };
};

export default useWsHub;
