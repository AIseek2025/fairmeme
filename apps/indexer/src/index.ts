// src/config.ts
import * as dotenv from 'dotenv';
import {FairMemeSol, IDL} from "./idl/fairmeme_sol";
import {FairMemeReferral, IDL as ReferralIDL} from "./idl/fairmeme_referral";
import * as anchor from "@coral-xyz/anchor";
import {AnchorProvider, Program} from "@coral-xyz/anchor";
import {Connection, PublicKey} from "@solana/web3.js";
import {getInvitedCodeAndUser, getTransactionEvents} from "./events";
import {readJsonFile, writeJsonFile} from "./last_processed"
import {AppDataSource} from './dataSource';
import {IsNull, Not} from "typeorm";
import {Holders, InvitationLog, members, Token, Trade, TradeLog} from './models/event';
import redis, {sendMessage} from './redis';
import axios from 'axios';
import {debugLog, FAIRMEME_PROGRAM_ID, FAIRMEME_REFERRAL_PROGRAM_ID, SOLANA_RPC_URL} from './config';

// 加载 .env 文件中的内容到 process.env
dotenv.config();
// Initialize connection to the Solana devnet
const connection = new Connection(SOLANA_RPC_URL);
const FAIRMEME_PROGRAM = new PublicKey(FAIRMEME_PROGRAM_ID);
const FAIRMEME_REFERRAL_PROGRAM = new PublicKey(FAIRMEME_REFERRAL_PROGRAM_ID);

const provider = new AnchorProvider(
    connection,
    {} as any,
    AnchorProvider.defaultOptions()
);

const program = new Program<FairMemeSol>(
    IDL,
    FAIRMEME_PROGRAM.toBase58(),
    provider
);

const referralProgram = new Program<FairMemeReferral>(
    ReferralIDL,
    FAIRMEME_REFERRAL_PROGRAM.toBase58(),
    provider
);


type Event = anchor.IdlEvents<(typeof program)["idl"]>;

// Function to get all signatures from a program ID
async function getEventsForProgram(
    connection: Connection,
    programId: PublicKey,
    latestSlot: number | 0,
    limit: number = 500
) {
    const options = {
        limit: limit,
        // before: latestSignature || undefined,
        // before:"2gEnN6Yo2p8naViqaPKnbFcyoWerakMYv6QesvnzNSjK4DtGRiyXWBePTiNh2244imG8k1Lch1Skk8uMVbTY54D",
        // minContextSlot: 315514047,

    };
    try {
        debugLog("fairmeme options:", options);
        const signatures = await connection.getSignaturesForAddress(
            programId,
            options
        );
        const createSolEvents = [];
        const txEvents = [];
        signatures.reverse();
        for (let i = 0; i < signatures.length; i++) {
            const signature = signatures[i];
            if (signature.slot > latestSlot) {
                latestSlot = signature.slot
                const txResponse = await connection.getTransaction(signature.signature, {
                    maxSupportedTransactionVersion: 0,
                    commitment: "confirmed",
                });

                const events = getTransactionEvents(program, txResponse);
                for (let j = 0; j < events.length; j++) {
                    const event = events[j];
                    if (event.name == "CreateEvent") {
                        createSolEvents.push({
                            name: event.name,
                            data: event.data,
                            transactionHash: event.transactionHash
                        });
                    } else if (event.name == "TradeEvent") {
                        txEvents.push({
                            name: event.name,
                            data: event.data,
                            transactionHash: event.transactionHash
                        });
                    }
                }

            }
        }
        debugLog("latestSlot:", latestSlot);
        writeJsonFile(latestSlot);
        const result = {
            solEvents: createSolEvents,
            txEvents: txEvents
        };

        return result;
    } catch (error) {
        console.error("Error fetching signatures:", error);
        return null;
    }
}

// Function to get all signatures from a program ID
async function getReferralForProgram(
    connection: Connection,
    programId: PublicKey,
    latestSlot: number | 0,
    limit: number = 500
) {
    const options = {
        limit: limit,
        // before: latestSignature || undefined,
        // before:"2gEnN6Yo2p8naViqaPKnbFcyoWerakMYv6QesvnzNSjK4DtGRiyXWBePTiNh2244imG8k1Lch1Skk8uMVbTY54D",
        // minContextSlot: 315514047,

    };
    try {
        debugLog("referral options:", options);
        const signatures = await connection.getSignaturesForAddress(
            programId,
            options
        );
        signatures.reverse();
        for (let i = 0; i < signatures.length; i++) {
            const signature = signatures[i];
            if (signature.slot > latestSlot) {
                latestSlot = signature.slot
                const txResponse = await connection.getTransaction(signature.signature, {
                    maxSupportedTransactionVersion: 0,
                    commitment: "confirmed",
                });
                let result = getInvitedCodeAndUser(txResponse, programId)
                debugLog(JSON.stringify(result[0]))
                await sendMessage("referral", JSON.stringify(result[0]))
            }
        }
        // writeJsonFile(latestSlot);
    } catch (error) {
        console.error("Error fetching signatures:", error);
        return null;
    }
}


interface EventData {
    name: string;
    data: any;
}


async function SaveSolToken(solEvents: any[]) {
    const solTokenRepository = AppDataSource.getRepository(Token);
    const solHoldersRepository = AppDataSource.getRepository(Holders);
    const solTradeRepository = AppDataSource.getRepository(Trade);
    const solPrice = await redis.get("solPrice")

    for (let index = 0; index < solEvents.length; index++) {
        const event = solEvents[index];
        debugLog(event)
        // const tokenLogoUri = String(event.data.uri);
        // let tokenLogo = "";
        // try {
        //     const response = await axios.get(tokenLogoUri);
        //     const metadata = response.data;
        //     tokenLogo = metadata.image;
        // } catch (error) {
        //     console.error("Error fetching token metadata:", error);
        // }
        // if (tokenLogo == "" || tokenLogo == null) {
        //     tokenLogo = tokenLogoUri;
        // }

        const solToken = solTokenRepository.create({
            chain_id: String("sol"),
            token_name: String(event.data.name),
            token_ticker: String(event.data.symbol),
            // token_logo: tokenLogo,
            auction_time: BigInt(event.data.auctionPeriod),
            token_address: String(event.data.mint),
            pair_address: String(event.data.fairMemeState),
            creator_address: String(event.data.creator),
            created_at: new Date(event.data.timestamp * 1000),
            // slot: BigInt(event.data.slot),
            total_supply: BigInt(1000000000000000),
            token_releasePerBlock: BigInt(event.data.tokenReleasePerSlot),
            start_block: BigInt(event.data.slot),
            token_released: BigInt(1000000 * 1000000),
            end_block: BigInt(event.data.slot) + BigInt(event.data.auctionPeriod),
        });
        const token = await solTokenRepository.findOne({
            where: {
                token_address: String(event.data.mint),
            }
        });
        let id = 0
        if (token) {
            id = token.id
            await solTokenRepository.update({id}, solToken);
        } else {
            const savedSolToken = await solTokenRepository.save(solToken);
            id = savedSolToken.id
        }


        const holderData = await solHoldersRepository.findOne({
            where: {
                token_address: String(event.data.mint),
            }
        });
        if (!holderData) {
            const holder = solHoldersRepository.create({
                token_address: String(event.data.mint),
                creator_address: String(event.data.creator),
                created_at: new Date(event.data.timestamp * 1000),
                balance: BigInt(1000000000),
                cost: BigInt(1000000000),
                sold: BigInt(0),
                token_balance: BigInt(event.data.tokenReceived),
            })
            solHoldersRepository.save(holder);
        }

        const solTrade = solTradeRepository.create({
            token_address: String(event.data.mint),
            trade_amount: BigInt(1e9),
            token_amount: BigInt(5e5 * 1e6),
            act: Number(2),
            creator_address: String(event.data.creator),
            chain_id: String("sol"),
            created_at: new Date(event.data.timestamp * 1000),
            slot: BigInt(event.data.slot),
            tx_hash: event.transactionHash,
            usd_price: Number(solPrice) * Number(1),
            native_reserves: BigInt(1e9),
            token_reserves: BigInt(5e5 * 1e6),
            token_releasePerSlot: BigInt(event.data.tokenReleasePerSlot),
            fee: BigInt(0),
        });
        await solTradeRepository.save(solTrade)
        await sendMessage("solCreateChannel", String(event.data.mint))
        await inviteAward(String(event.data.creator), 50000, "create")
    }
}

async function SaveTxToken(txEvents: any[]) {
    const solTradeRepository = AppDataSource.getRepository(Trade);
    const solTradeLogRepository = AppDataSource.getRepository(TradeLog);
    const solPrice = await redis.get("solPrice")

    for (let index = 0; index < txEvents.length; index++) {
        const event = txEvents[index];
        const solTradeData = await solTradeRepository.findOne({
            where: {
                tx_hash: String(event.transactionHash),
            }
        });
        if (solTradeData){
            continue
        }
        let solNumber = Number(BigInt(event.data.solAmount)) / 1000000000
        const solTrade = solTradeRepository.create({
            token_address: String(event.data.mint),
            trade_amount: BigInt(event.data.solAmount),
            token_amount: BigInt(event.data.tokenAmount),
            act: Number(Boolean(event.data.isBuy)) + 1,
            creator_address: String(event.data.user),
            chain_id: String("sol"),
            created_at: new Date(event.data.timestamp * 1000),
            slot: BigInt(event.data.slot),
            tx_hash: event.transactionHash,
            fee: BigInt(event.data.fee),
            usd_price: Number(solPrice) * Number(solNumber),
            native_reserves: BigInt(event.data.solReserves),
            token_reserves: BigInt(event.data.tokenReserves),
            token_releasePerSlot: BigInt(event.data.tokenReleasePerSlot),
        });
        if (BigInt(event.data.solAmount) > 1e6) {
            const solTradeLog = solTradeLogRepository.create({
                rewards: Math.round(Number(BigInt(event.data.solAmount)) / 1e6),
                creator_address: String(event.data.user),
                created_time: event.data.timestamp,
                trade_volume: BigInt(event.data.solAmount),
                tx_hash: event.transactionHash,
            });
            await solTradeLogRepository.save(solTradeLog)
            await inviteAward(String(event.data.user), Number(BigInt(event.data.solAmount)), "trade")
        }
        const solTokenRepository = AppDataSource.getRepository(Token);
        const token = await solTokenRepository.findOne({
            where: {
                chain_id: String("sol"),
                token_address: String(event.data.mint),
                pair_address: Not(IsNull())
            }
        });

        if (token) {
            const solHoldersRepository = AppDataSource.getRepository(Holders);
            const holderInfo = await solHoldersRepository.findOne({
                where: {
                    token_address: String(event.data.mint),
                    creator_address: String(event.data.user),
                }
            });
            if (holderInfo != null) {
                const holder = solHoldersRepository.create({
                    updated_at: new Date(event.data.timestamp * 1000),
                    balance: Boolean(event.data.isBuy) ? BigInt(holderInfo.balance) + BigInt(event.data.solAmount) : BigInt(holderInfo.balance) - BigInt(event.data.solAmount),
                    token_balance: Boolean(event.data.isBuy) ? BigInt(holderInfo.token_balance) + BigInt(event.data.tokenAmount) : BigInt(holderInfo.token_balance) - BigInt(event.data.tokenAmount),
                    cost: Boolean(event.data.isBuy) ? BigInt(holderInfo.cost) + BigInt(event.data.solAmount) : BigInt(holderInfo.cost),
                    sold: Boolean(event.data.isBuy) ? BigInt(holderInfo.sold) : BigInt(holderInfo.sold) + BigInt(event.data.solAmount),
                })
                let id = holderInfo.id
                await solHoldersRepository.update({id}, holder);
            } else {
                const holder = solHoldersRepository.create({
                    token_address: String(event.data.mint),
                    creator_address: String(event.data.user),
                    created_at: new Date(event.data.timestamp * 1000),
                    balance: BigInt(event.data.solAmount),
                    cost: BigInt(event.data.solAmount),
                    sold: BigInt(0),
                    token_balance: BigInt(event.data.tokenAmount),
                })
                await solHoldersRepository.save(holder);
            }
        } else {
            debugLog("Token not found");
        }
        await solTradeRepository.save(solTrade)
        await sendMessage("solTradeChannel", "trade")
    }
}

async function ReadAndSaveEvents() {
    const latestSlot = readJsonFile();
    debugLog("latestSlot:", latestSlot);
    const result = await getEventsForProgram(
        connection,
        FAIRMEME_PROGRAM,
        latestSlot
    );

    await getReferralForProgram(
        connection,
        FAIRMEME_REFERRAL_PROGRAM,
        latestSlot
    );
    debugLog("result:", result);
    if (result) {
        debugLog("Store complete:", result.txEvents.length, ":", result.txEvents);
        debugLog("Store complete:", result.solEvents.length, ":", result.solEvents);
        if (result.solEvents.length > 0) {
            await SaveSolToken(result.solEvents)
        }
        if (result.txEvents.length > 0) {
            await SaveTxToken(result.txEvents)
        }
    }
}

async function main() {
    await AppDataSource.initialize();
    while (true) {
        await ReadAndSaveEvents()
        await sleep(1000)
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function inviteAward(creatorAddress: string, rewards: number, type: string) {
    const membersRepository = AppDataSource.getRepository(members);
    const invitationLogRepository = AppDataSource.getRepository(InvitationLog);

    const invitedCode = await membersRepository.findOne({
        where: {creator_address: creatorAddress},
    });

    if (invitedCode?.invited_code) {

        const inviteAddress = await membersRepository.findOne({
            where: {id: invitedCode.id,creator_address: Not(creatorAddress)},
        });

        const reward = (type === "create") ? 5000 : Math.round(rewards / 1e7);

        const invitationLog = invitationLogRepository.create({
            creator_address: String(inviteAddress?.creator_address),
            invited_address: String(creatorAddress),
            created_time: Number(Math.floor(Date.now() / 1000)),
            rewards: reward,
            type: 1
        });

        await invitationLogRepository.save(invitationLog);
    }
}


main()
