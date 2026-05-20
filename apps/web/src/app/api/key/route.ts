import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/authOptions';
import { createPinataServerClient } from '../../../utils/pinata';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ text: 'Unauthorized' }, { status: 401 });
    }

    try {
        const uuid = crypto.randomUUID();
        const pinata = await createPinataServerClient();
        const keyData = await pinata.keys.create({
            keyName: uuid.toString(),
            permissions: {
                endpoints: {
                    pinning: {
                        pinFileToIPFS: true,
                        pinJSONToIPFS: true,
                    },
                },
            },
            maxUses: 2,
        });
        return NextResponse.json(keyData, { status: 200 });
    } catch (error) {
        console.error('Error creating Pinata API key', error);
        return NextResponse.json({ text: 'Error creating API Key:' }, { status: 500 });
    }
}
