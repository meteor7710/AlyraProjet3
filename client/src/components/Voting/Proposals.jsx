import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Proposals() {
  const { state: { contract, accounts, creationBlock } } = useEth();
  const [proposalToAdd, setProposalToAdd] = useState();
  const [addProposalLog, setAddProposalLog]= useState();
  const [proposalsInformations, setProposalsInformations] = useState([]);

  //Manage Proposal input
  const handleProposalChange = e => {
    setProposalToAdd(e.target.value);
  };

  //Add Proposal
  const addProposal = async () => {
    if (proposalToAdd === "") {alert("Proposal description must be not null"); }

    if (await contract.methods.addProposal(proposalToAdd).call({ from: accounts[0] })){
      const addProposalTx = await contract.methods.addProposal(proposalToAdd).send({ from: accounts[0] });

      const addedProposalId = addProposalTx.events.ProposalRegistered.returnValues.proposalId;
      setAddProposalLog ("Proposal "+ addedProposalId+ " registered");
    }
  };

  //show proposal already registered
  useEffect(() => {
    (async function () {

      //Get proposal information from a proposal ID
      async function getProposalInformations(proposalId){
        let proposal =[];
        proposal = await contract.methods.getOneProposal(parseInt(proposalId)).call({ from: accounts[0] });
        return proposal;
      };

      const proposalRegisteredEvents= await contract.getPastEvents('ProposalRegistered', {fromBlock: creationBlock,toBlock: 'latest'});
      const proposalsList=[];

      for (let i=0; i < proposalRegisteredEvents.length ; i++)
      {
        let proposal = [];
        proposal = await getProposalInformations(i+1);

        proposalsList.push(
          {
            id: proposalRegisteredEvents[i].returnValues.proposalId,
            description: proposal.description,
          });
      };

      const listProposal = proposalsList.map((prop,index) => 
        <tr key={"proposal"+index}>
          <td>{prop.id}</td>
          <td>{prop.description}</td>
        </tr>
      );
      setProposalsInformations(listProposal);
    })();
  }, [contract,accounts,creationBlock,addProposalLog])
  

  return (
      <section className="proposals">
        <h3>Proposals</h3>
        <div>
          <label htmlFor="AddProposal">Add address to whitelist : </label>
          <textarea name="AddProposal" cols="40" rows="5"  placeholder="Add proposal description" onChange={handleProposalChange} value={proposalToAdd} autoComplete="off"></textarea>
          <button onClick={addProposal}>Add Proposal </button>
        </div>
        <div>
          <span>Logs : </span><span>{addProposalLog}</span>
        </div>
        <div>
          <span>Proposals already whitelisted :</span>
          <table>
              <thead>
                <tr>
                  <th>Proposal ID</th>
                  <th>Proposal Description</th>
                </tr>
              </thead>
            <tbody>{proposalsInformations}</tbody>
          </table>
        </div>
      </section>
  );
}

export default Proposals;
