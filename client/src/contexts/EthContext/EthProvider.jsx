import React, { useReducer, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [account, setAccount] = useState("");

  const init = useCallback(
    async artifact => {
      if (artifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = artifact;
        let address, contract, owner, creationBlock;
        try {
          address = artifact.networks[networkID].address;
          contract = new web3.eth.Contract(abi, address);
          //Add owner state to filter views
          owner = await contract.methods.owner().call();
          //Add contract creation block to reduce event queries
          const deployTx = await web3.eth.getTransaction(artifact.networks[networkID].transactionHash);
          creationBlock =  deployTx.blockNumber;

        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact, web3, accounts, networkID, contract, owner, creationBlock }
        });
        setAccount(accounts[0]);
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifact = require("../../contracts/Voting.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  const connectToMetaMask = async () => {
    try {
      await window.ethereum.enable();
      const artifact = require("../../contracts/Voting.json");
      init(artifact);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  
  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      <div>
        {account ? `Connecté avec l'adresse : ${account}` : <button onClick={connectToMetaMask}>Se connecter à MetaMask</button>}
      </div>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
