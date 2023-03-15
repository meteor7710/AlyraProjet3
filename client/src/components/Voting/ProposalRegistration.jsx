import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ProposalRegistration({addProposalLog,setAddProposalLog}) {
    const { state: { contract, accounts } } = useEth();
    const [proposalToAdd, setProposalToAdd] = useState();

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

  return (
    <section className="proposalRegistration">
        <h3>Proposal Registration</h3>
        <div>
          <label htmlFor="AddProposal">Add address to whitelist : </label>
          <textarea name="AddProposal" cols="40" rows="5"  placeholder="Add proposal description" onChange={handleProposalChange} value={proposalToAdd} autoComplete="off"></textarea>
          <button onClick={addProposal}>Add Proposal </button>
        </div>
        <div>
          <span>Logs : </span><span>{addProposalLog}</span>
        </div>
    </section>

  );

}

export default ProposalRegistration;