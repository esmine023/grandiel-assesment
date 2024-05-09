import {
    Keypair,
    Connection,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
} from '@solana/web3.js';

export async function createKeypair(): Promise<Keypair> {
    const createdKeypair = Keypair.generate();
    return createdKeypair;
}

export async function getWalletBalance(publicKey: PublicKey): Promise<number> {
    const connection = new Connection(clusterApiUrl("devnet"), 'confirmed');
    const walletBalance = await connection.getBalance(publicKey);
    let balance: number = walletBalance / LAMPORTS_PER_SOL;
    return balance
}

export async function airdropSol(publicKey: PublicKey, sol: number): Promise<void>{
    const connection = new Connection(clusterApiUrl("devnet"), 'confirmed');

    const signature = await connection.requestAirdrop(
        publicKey,
        sol * LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(signature);
}

export async function transferSol(fromKeyPair: Keypair, toKeyPair: Keypair, sol: number): Promise<void> {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), 'confirmed');
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: fromKeyPair.publicKey,
                toPubkey: toKeyPair.publicKey,
                lamports: sol * LAMPORTS_PER_SOL,
            })
        );
        await sendAndConfirmTransaction(connection, transaction, [fromKeyPair]);
    } catch (err) {
        console.log(err)
    }
}

