import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ProposalInformations() {

  const { state: { contract, accounts, creationBlock } } = useEth();
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

    //Validate proposal ID
    if (proposalIDToQuery === "") {alert("Proposal ID must be not null");return; }
    if (proposalIDToQuery === "0") {alert("Proposal ID must be not 0");setProposalIDToQuery("");return; }
    const proposalRegisteredEvents= await contract.getPastEvents('ProposalRegistered', {fromBlock: creationBlock,toBlock: 'latest'});
    if (proposalIDToQuery > proposalRegisteredEvents.length) {alert("Proposal ID must be lower or equal than "+proposalRegisteredEvents.length);setProposalIDToQuery("");return; }
       
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
    setProposalIDToQuery("");
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
