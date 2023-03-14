import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ProposalInformations() {

  const { state: { contract, accounts } } = useEth();
  const [proposalIDToQuery, setProposalIDToQuery] = useState("");
  const [proposalHistory, setProposalHistory] = useState([]);
  const [proposalInformations, setProposalInformations] = useState([]);


  //Manage proposal input. It can only be interger
  const handleIDChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setProposalIDToQuery(e.target.value);
    }
  };

  //Reset proposals informations table
  const resetProposalHistory = async () => {
    setProposalHistory("");
    setProposalInformations([]);
  };

  //Get proposal informations from an ID
  const getProposalInformation = async () => {
       
    const proposalReturns = await contract.methods.getOneProposal(proposalIDToQuery).call({ from: accounts[0] });

    let proposalDisplay = [];

    proposalDisplay = Array.from(proposalHistory);

    proposalDisplay.push(
      {
        id: proposalIDToQuery,
        description: proposalReturns.description.toString(),
        voteCount: proposalReturns.voteCount.toString(),
      }
    )
    
     //manage proposals informations request history
    setProposalHistory(proposalDisplay);

    const proposalRendered = proposalDisplay.map((prop,index) => 
      <tr key={"prop"+index}>
        <td>{prop.id}</td>
        <td>{prop.description}</td>
        <td>{prop.voteCount}</td>
      </tr>
    );

    setProposalInformations(proposalRendered); 
  };

  return (
    <section className="proposalInformations">
      <h3>Proposal Informations</h3>
      <div>
        <label htmlFor="proposalInformation">Get proposal informations : </label>
        <input type="text" id="proposalInformation" name="proposalInformation" placeholder="Add proposal ID" onChange={handleIDChange} value={proposalIDToQuery} autoComplete="off"/>
        <button onClick={getProposalInformation}>Get informations</button>
        <button onClick={resetProposalHistory}>Reset informations</button>
      </div>
      <div>
        <table>
            <thead>
              <tr>
                <th>Proposal ID</th>
                <th>Proposal description</th>
                <th>Proposal vote count</th>
              </tr>
            </thead>
            <tbody>{proposalInformations}</tbody>
        </table>
      </div>
    </section>
  );
}

export default ProposalInformations;
