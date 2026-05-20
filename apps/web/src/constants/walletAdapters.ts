import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    LedgerWalletAdapter,
    CloverWalletAdapter,
    Coin98WalletAdapter,
    CoinhubWalletAdapter,
    MathWalletAdapter,
    KeystoneWalletAdapter,
    NightlyWalletAdapter,
    NufiWalletAdapter,
    TokenPocketWalletAdapter,
} from '@solana/wallet-adapter-wallets';

export const walletAdapters = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TokenPocketWalletAdapter(),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
    new CloverWalletAdapter(),
    new Coin98WalletAdapter(),
    new CoinhubWalletAdapter(),
    new MathWalletAdapter(),
    new KeystoneWalletAdapter(),
    new NightlyWalletAdapter(),
    new NufiWalletAdapter(),
];
