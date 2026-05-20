import {FairMemeSol, IDL} from './idl/fairmeme_sol'
import { BorshInstructionCoder, Idl } from '@coral-xyz/anchor';
import {AnchorProvider, Program} from '@coral-xyz/anchor'
import {VersionedTransactionResponse ,Connection, PublicKey} from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import {FairMemeReferral, IDL as ReferralIDL} from "./idl/fairmeme_referral";
type EventKeys = keyof anchor.IdlEvents<FairMemeSol>

const validEventNames: Array<keyof anchor.IdlEvents<FairMemeSol>> = [
    'CreateEvent',
    'TradeEvent',
]

export const getTransactionEvents = (
    program: anchor.Program<FairMemeSol>,
    txResponse: anchor.web3.VersionedTransactionResponse | null
) => {
    if (!txResponse) {
        return []
    }

    let [eventPDA] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('__event_authority')], program.programId)

    let indexOfEventPDA = txResponse.transaction.message.staticAccountKeys.findIndex(key => key.equals(eventPDA))

    if (indexOfEventPDA === -1) {
        return []
    }

    const matchingInstructions = txResponse.meta?.innerInstructions
        ?.flatMap(ix => ix.instructions)
        .filter(instruction => instruction.accounts.length === 1 && instruction.accounts[0] === indexOfEventPDA)

    if (matchingInstructions) {
        let transactionHash = txResponse.transaction.signatures[0]
        let events = matchingInstructions.map(instruction => {
            const ixData = anchor.utils.bytes.bs58.decode(instruction.data)
            const eventData = anchor.utils.bytes.base64.encode(ixData.slice(8))
            const event = program.coder.events.decode(eventData)
            return {
                ...event,
                transactionHash
            }
        })
        const isNotNull = <T>(value: T | null): value is T => {
            return value !== null
        }
        return events.filter(isNotNull)
    } else {
        return []
    }
}


interface StoreInstructionData {
    invitedCode: string;
}

export const getInvitedCodeAndUser = (
    txResponse: VersionedTransactionResponse | null,
    programId: PublicKey,
): { invited_code: string; user: PublicKey }[] => {
    if (!txResponse) {
        return [];
    }

    const instructionCoder = new BorshInstructionCoder(ReferralIDL as Idl);

    const accountKeys = txResponse.transaction.message.staticAccountKeys;

    const instructions = txResponse.transaction.message.compiledInstructions;

    const results = [];
    for (const ix of instructions) {
        const ixProgramId = accountKeys[ix.programIdIndex];

        if (ixProgramId.equals(programId)) {

            const decoded = instructionCoder.decode(Buffer.from(ix.data));

            if (decoded && decoded.name === 'store') {
                const data = decoded.data as StoreInstructionData;
                const { invitedCode } = data;

                const userAccountIndex = ix.accountKeyIndexes[0];
                const userPubkey = accountKeys[userAccountIndex];

                results.push({
                    invited_code:invitedCode,
                    user: userPubkey,
                });
            }
        }
    }

    return results;
};