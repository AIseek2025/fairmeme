import Redis from 'ioredis';
import { debugLog } from './config';

const redis = new Redis({
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: Number(process.env.REDIS_PORT ?? 6379),
    username: process.env.REDIS_USER ?? '',
    password: process.env.REDIS_PASS ?? '',
    db: Number(process.env.REDIS_DB ?? 0),
    retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        debugLog(`Reconnecting attempt #${times}, retrying in ${delay}ms`);
        return delay;
    },
    reconnectOnError: (err: Error) => {
        if (err.message.includes('READONLY')) {
            debugLog('Reconnect on error:', err.message);
            return true;
        }
        return false;
    },
});

redis.on('connect', () => {
    debugLog('Redis client connected');
});

redis.on('reconnecting', (times: number) => {
    debugLog(`Redis client reconnecting, attempt #${times}`);
});

redis.on('error', (err: Error) => {
    console.error('Redis client encountered an error:', err);
});

export const sendMessage = async (channel: string, message: string) => {
    try {
        await redis.publish(channel, message);
        debugLog(`Message published to channel ${channel}: ${message}`);
    } catch (err) {
        console.error('Failed to publish message:', err);
    }
};

export default redis;
