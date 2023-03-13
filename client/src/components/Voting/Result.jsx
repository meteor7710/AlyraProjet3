import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";

function Result() {
  const { state: { accounts, contract, artifact }} = useEth();
  const [result, setResult] = useState([]);

  useEffect(() => {
    async function getResult() {
      if (contract) {
        const winnerId = await contract.methods.winningProposalID().call({ from: accounts[0] });
        const winnerProposal = await contract.methods.getOneProposal(parseInt(winnerId)).call({ from: accounts[0] });
        console.log(winnerProposal);
        setResult(winnerProposal);
      }
    };

    getResult();
  }, [accounts, contract, artifact]);

  return (
    <div className="result">
      <h3>Result</h3>
      <p>{result.winnerId} with {result.description}</p>
    </div>
  );
}

export default Result;
