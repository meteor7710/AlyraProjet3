import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";

function Votes() {
  const { state: { accounts, contract, artifact }} = useEth();
  const [proposals, setVote] = useState([]);

  useEffect(() => {

    (async () => {
      setVote(await getVote());
    })();
  }, [accounts, contract, artifact]);

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
              </tr>  
            )}
          </tbody>
        </table>
        <button onSubmit={() => handleClick(proposal.id)}>add your Vote</button>          
      </div>
    </div> 
  );
}

export default Votes;
