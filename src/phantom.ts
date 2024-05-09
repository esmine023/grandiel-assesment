import {
    PublicKey,
    Transaction,
    Keypair,
} from "@solana/web3.js";

type DisplayEncoding = "utf8" | "hex";

type PhantomEvent = "disconnect" | "connect" | "accountChanged";
type PhantomRequestMethod =
    | "connect"
    | "disconnect"
    | "signTransaction"
    | "signAllTransactions"
    | "signMessage";

interface ConnectOpts {
    onlyIfTrusted: boolean;
}

export interface PhantomProvider {
    publicKey: PublicKey | null;
    isConnected: boolean | null;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    signMessage: (
        message: Uint8Array | string,
        display?: DisplayEncoding
    ) => Promise<any>;
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: () => Promise<void>;
    on: (event: PhantomEvent, handler: (args: any) => void) => void;
    request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export const getProvider = (): PhantomProvider | undefined => {
    if ("solana" in window) {
    // @ts-ignore
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
    }
};

export async function connectWallet(): Promise<Keypair | undefined> {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
    try {
        const response = await solana.connect();
        return response;
    } catch (err) {
    // { code: 4001, message: 'User rejected the request.' }
    }
    }
    return undefined;
};

export async function disconnectWallet() {
    // @ts-ignore
    const { solana } = window;
    if (solana && solana.isConnected) {
    await solana.disconnect();
    }
};
