import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { fairMemeSolanaProgramIDL } from '@/abi/fairMemeSolanaProgram';
import { fairMemeSolanaProgramIDLProd } from '@/abi/fairMemeSolanaProgramProd';
import { PUBLICKEY_FOR_SOLANA_PROGRAM_ID, GLOBAL_SEED, FAIR_MEME_STATE_SEED } from '@/constants/solana';
import { IS_TEST } from '@/constants/env';

export const programId = new PublicKey(PUBLICKEY_FOR_SOLANA_PROGRAM_ID);
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    IS_TEST ? 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s' : 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);
export const getFairMemeSolanaProgram = (anchorProvider: AnchorProvider) =>
    new Program(
        IS_TEST ? fairMemeSolanaProgramIDL : fairMemeSolanaProgramIDLProd,
        programId.toBase58(),
        anchorProvider,
    );

export const getCommonAccountParams = async (publicKey: PublicKey) => {
    const mint = Keypair.generate();
    const dev = Keypair.generate();

    const devAuthority = dev.publicKey;
    const [globalPDA] = PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_SEED)], programId);
    const [fairMemeStatePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(FAIR_MEME_STATE_SEED), mint.publicKey.toBuffer()],
        programId,
    );
    const [metadataAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.publicKey.toBuffer()],
        TOKEN_METADATA_PROGRAM_ID,
    );
    const creatorTokenAccount = await getAssociatedTokenAddress(mint.publicKey, publicKey);
    const fairMemeTokenAccount = await getAssociatedTokenAddress(mint.publicKey, fairMemeStatePDA, true);
    const [mintAuthority] = PublicKey.findProgramAddressSync([Buffer.from('mint-authority')], programId);
    const systemProgram = SystemProgram.programId;

    return {
        mint,
        dev,
        globalPDA,
        fairMemeStatePDA,
        devAuthority,
        metadataAddress,
        fairMemeTokenAccount,
        mintAuthority,
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        TOKEN_METADATA_PROGRAM_ID,
        SYSVAR_RENT_PUBKEY,
        systemProgram,
        creatorTokenAccount,
    };
};
