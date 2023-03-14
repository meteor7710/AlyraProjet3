import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";

function Result({currentWorkflowStatus}) {
  const { state: { accounts, contract }} = useEth();
  const [result, setResult] = useState();

  useEffect(() => {
    async function getResult() {
      if (currentWorkflowStatus === "5") {
        const winnerId = await contract.methods.winningProposalID().call({ from: accounts[0] });
        const winnerProposal = await contract.methods.getOneProposal(winnerId).call({ from: accounts[0] });
        const winnerDesc = winnerProposal.description;

        const proposalRendered = (
          <table>
            <thead>
              <tr>
                <th>Wining Proposal ID</th>
                <th>Wining Proposal description</th>
              </tr>
            </thead>
            <tbody>
              <tr key={"winner"}>
                <td>{winnerId}</td>
                <td>{winnerDesc}</td>
              </tr>
            </tbody>
          </table>
        );

        setResult(proposalRendered);
      }
    };
    getResult();
  }, [accounts, contract,currentWorkflowStatus]);

  return (
    <section className="result">
      <h3>Result</h3>
      {
          (currentWorkflowStatus === "5") ? <div>{result}</div> :
          <span>Votes are not tallied</span>
      }
    </section>
  );
}

export default Result;
