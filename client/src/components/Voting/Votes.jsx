import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";

function Votes() {
  const { state: { accounts, contract, artifact }} = useEth();
  const [proposals, setVote] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {

    (async () => {
      setVote(await getVote());
    })();
  }, []);

  const handleClick = async (proposalId) => {
    await proposals(proposalId);
  }

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
                  <td>
                      {(hasVoted && votedProposalId === proposal.id) && '√'}
                      {(hasVoted && votedProposalId !== proposal.id) && ''}
                      {!hasVoted && <button onSubmit={() => handleClick(proposal.id)}>add your Vote</button>}
                  </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    
  );
}

export default Votes;
