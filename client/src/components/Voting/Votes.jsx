//import { useState, useEffect } from "react";
//import { useEth } from "../../contexts/EthContext";

function Votes() {
  /*const { state: { accounts, contract, artifact }} = useEth();
  const [proposals, setVote] = useState([]);

  useEffect(() => {
    async function getProposals() {
      if (contract) {
        const eventProposals = await contract.getPastEvents("ProposalRegistered", { fromBlock: 0, toBlock: "latest" });
        const proposalsId = eventProposals.map((proposal) => proposal.returnValues._proposalId);

        let proposalsDatas = [];

        for (const id of proposalsId) {
          const proposal = await contract.methods.getOneProposal(parseInt(id)).call({ from: accounts[0] });
          proposalsDatas.push(
            {
              key: id,
              text: proposal.description,
              value: id
            }
          );
        }
        setVote(proposalsDatas);
      }
    };
    getProposals();
  }, [accounts, contract, artifact]);

  const handleClick = async (proposalId) => {
  await proposals(proposalId);
  }

  //const handleVote = async () => {
  //  await contract.methods.setVote(parseInt(selectedProposal)).send({ from: accounts[0] });
  //  window.location.reload();
  //}

  return (
    <div className="votes">
      <h3>Votes</h3>
      <div>
        <h4>Choose your favorite proposal !</h4>
        <table>
          <tbody>
            {proposals.map((proposal) =>
              <tr key={proposal.id}>
                  <td>{proposal.id}</td>
                  <td>{proposal.description}</td>
              </tr>  
            )}
          </tbody>
        </table>
        <button onSubmit={() => handleClick("0")}>add your Vote</button>          
      </div>
    </div> 
  );*/
}

export default Votes;
