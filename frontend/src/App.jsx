import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {
  
  const [currentAccount, setCurrentAccount] = useState("");
  const [messageStr, setMessageStr] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xFC4CAB9E76EF31618f5465E5AC17A2989579eD8a";
  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possua a Metamask instalada!");
        return;
      } else {
        console.log("Temos o objeto ethereum", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implemente aqui o seu método connectWallet
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  /*
   * Método para consultar todos os tchauzinhos do contrato
   */
  const getAllWaves = async () => {
  const { ethereum } = window;

  try {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      const waves = await wavePortalContract.getAllWaves();

      const wavesCleaned = waves.map(wave => {
        return {
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message,
        };
      });

      setAllWaves(wavesCleaned);
    } else {
      console.log("Objeto Ethereum inexistente!");
    }
  } catch (error) {
    console.log(error);
  }
};
  
 const wave = async () => {
   
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado o número de tchauzinhos...", count.toNumber());

         /*
        * Executar o tchauzinho a partir do contrato inteligente
        */
        const waveTxn = await       
          
        wavePortalContract.wave(messageStr, { gasLimit: 300000 });
        
        console.log("Minerando...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Minerado -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Total de tchauzinhos recuperado...", count.toNumber());
        
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
}
  

 return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Conecte sua carteira  Ethereum wallet e me manda um tchauzinho!
        </div>


        <input type="text" onChange={(e) => setMessageStr(e.target.value)} />
        
        <button className="waveButton" onClick={wave}>
          Mandar Tchauzinho 🌟
        </button>
        {/*
        * Se não existir currentAccount, apresente este botão
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conectar carteira
          </button>
        )}

        {console.log(allWaves)}
        {allWaves.map((wave, index) => {
        console.log(wave);
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Endereço: {wave.address}</div>
              <div>Data/Horário: {wave.timestamp.toString()}</div>
              <div>Mensagem: {wave.message}</div>
            </div>)
        })}
        

        

       
      </div>
      
    </div>
  );
}
