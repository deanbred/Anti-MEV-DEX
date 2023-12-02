import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useState } from "react";

export default function ConnectButton() {
  const [loading, setLoading] = useState(false);
  const { open } = useWeb3Modal();

  async function onOpen() {
    setLoading(true);
    await open();
    setLoading(false);
  }

  return (
    <button className="swapButton" onClick={onOpen} disabled={loading}>
      {loading ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}