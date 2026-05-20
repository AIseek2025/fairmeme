'use server';

import 'server-only';
import { PinataSDK } from 'pinata-web3';

export async function createPinataServerClient() {
    return new PinataSDK({
        pinataJwt:
            process.env.NEXT_PUBLIC_ENV === 'test' ? `${process.env.PINATA_JWT}` : `${process.env.PINATA_JWT_FOR_PROD}`,
        pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
    });
}
