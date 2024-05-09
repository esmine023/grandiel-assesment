import React, { Key } from 'react';
import './App.css';
import {
  Keypair,
} from "@solana/web3.js";
import {useEffect , useState } from "react";

import {
  createKeypair,
  getWalletBalance,
  airdropSol,
  transferSol,
} from './commonUtil';

import {
  PhantomProvider,
  getProvider,
  connectWallet,
  disconnectWallet,
} from './phantom';

window.Buffer = window.Buffer || require("buffer").Buffer;

function App() {

    const [provider, setProvider] = useState<PhantomProvider | undefined>(undefined);
    const [SenderKeypair, setSenderKeypair] = useState<Keypair | undefined>(undefined);
    const [SenderWalletBalance, setSenderWalletBalance] = useState<number | 0>(0);
    const [ReceiverKeypair, setReceiverKeypair] = useState<Keypair | undefined>(undefined);
    const [ReceiverWalletBalance, setReceiverWalletBalance] = useState<number | 0>(0);

    useEffect(() => {
      const provider = getProvider();
      if (provider) setProvider(provider);
      else setProvider(undefined);
    }, []);

    const createSender = async() => {
      const keypair = await createKeypair();
      await airdropSol(keypair.publicKey, 2);
      const balance = await getWalletBalance(keypair.publicKey);
      setSenderKeypair(keypair);
      setSenderWalletBalance(balance);
    }

    const airDropToSender = async() => {
      await airdropSol(SenderKeypair!.publicKey, 2);
      const balance = await getWalletBalance(SenderKeypair!.publicKey);
      setSenderWalletBalance(balance);
    }

    const connectReceiver = async() => {
      const keypair = await connectWallet();
      const balance = await getWalletBalance(keypair!.publicKey);
      setReceiverKeypair(keypair);
      setReceiverWalletBalance(balance)
    }

    const disconnectReceiver = async() => {
      if (ReceiverKeypair) {
        await disconnectWallet();
        setReceiverKeypair(undefined);
      }
    }

    const transferSolFromSenderToReceiver = async() => {
        if (SenderKeypair && ReceiverKeypair) {
            await transferSol(SenderKeypair, ReceiverKeypair, 2);
            let balanceSender = await getWalletBalance(SenderKeypair!.publicKey);
            setSenderWalletBalance(balanceSender);
            let balanceReceiver = await getWalletBalance(ReceiverKeypair!.publicKey);
            setReceiverWalletBalance(balanceReceiver);
        }
    }

    return (
        <div className='App'>
            <header className='App-header'>
                {!SenderKeypair && (<button onClick={createSender}>Create a new Solana account</button>)}
                {SenderKeypair && (
                    <p>
                        <button onClick={airDropToSender}>Airdrop 2 Sol</button>
                        <br></br>
                        Sender: {SenderKeypair!.publicKey.toString()}
                        <br></br>
                        Balance : {SenderWalletBalance} SOL
                    </p>
                )}

                {provider && !ReceiverKeypair && (<button onClick={connectReceiver}>Connect to Phantom Wallet</button>)}

                {SenderKeypair && ReceiverKeypair && (<button onClick={transferSolFromSenderToReceiver}>Transfer to new wallet</button>)}

                {provider && ReceiverKeypair && (
                    <p>
                        <button onClick={disconnectReceiver}>Disconnect Receiver Wallet</button>
                        <br></br>
                        Receiver: {ReceiverKeypair!.publicKey.toString()}
                        <br></br>
                        Balance: {ReceiverWalletBalance} SOL
                    </p>
                )}

                {!provider && (
                    <p>
                        No provider found. Install{" "}<a href='https://phantom.app/'>Phantom Browser extension</a>
                    </p>
                )}
            </header>
        </div>
    )
}


export default App;
