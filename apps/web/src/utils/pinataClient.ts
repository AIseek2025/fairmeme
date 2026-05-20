import { PinataSDK } from 'pinata-web3';

export const createPinataClient = () =>
    new PinataSDK({
        pinataJwt: '',
        pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL ?? 'gateway.pinata.cloud',
    });
