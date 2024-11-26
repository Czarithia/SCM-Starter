import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      const wallet = new ethers.providers.Web3Provider(window.ethereum);
      setEthWallet(wallet);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("Please install MetaMask to use this application.");
      return;
    }

    const accounts = await ethWallet.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    initializeContract();
  };

  const initializeContract = () => {
    if (ethWallet) {
      const signer = ethWallet.getSigner();
      const contract = new ethers.Contract(contractAddress, atmABI, signer);
      setATM(contract);
    }
  };

  const getBalance = async () => {
    if (atm) {
      const userBalance = await atm.getBalance();
      setBalance(userBalance.toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      const tx = await atm.deposit();
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      const tx = await atm.withdraw();
      await tx.wait();
      getBalance();
    }
  };

  const transfer = async () => {
    if (atm) {
      const tx = await atm.transfer();
      await tx.wait();
      getBalance();
    }
  };

  const renderUI = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this application.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Connect Your MetaMask Wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1</button>
        <button onClick={withdraw}>Withdraw 1</button>
        <button onClick={transfer}>Transfer 100</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {renderUI()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
