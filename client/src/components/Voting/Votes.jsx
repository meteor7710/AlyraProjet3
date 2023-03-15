import { useState } from "react";
import { useEth } from "../../contexts/EthContext";

function Votes() {
  const { state: { accounts, contract, creationBlock } } = useEth();

  const [voteLog, setVoteLog] = useState([]);
  const [proposalIDToVote, setProposalIDToVote] = useState("");

  //Manage proposal input. It can only be interger
  const handleIDChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setProposalIDToVote(e.target.value);
    }
  };

  //Submit to contract
  const voteProposalId = async () => {

    //Validate proposal ID
    if (proposalIDToVote === "") {alert("Proposal ID must be not null");return; }
    if (proposalIDToVote === "0") {alert("Proposal ID must be not 0");setProposalIDToVote("");return; }
    const proposalRegisteredEvents= await contract.getPastEvents('ProposalRegistered', {fromBlock: creationBlock,toBlock: 'latest'});
    if (proposalIDToVote > proposalRegisteredEvents.length) {alert("Proposal ID must be lower or equal than "+proposalRegisteredEvents.length);setProposalIDToVote("");return; }

    //Validate user has not already voted
    const voterReturns = await contract.methods.getVoter(accounts[0]).call({ from: accounts[0] });
    if ( voterReturns.hasVoted) { 
      alert("You have already voted"); 
      setProposalIDToVote("");
      return;
    }

    if (await contract.methods.setVote(proposalIDToVote).call({ from: accounts[0] })) {
      const setVoteTx = await contract.methods.setVote(proposalIDToVote).send({ from: accounts[0] });

      setProposalIDToVote("");

      const votedProposalID =  setVoteTx.events.Voted.returnValues.proposalId;
      setVoteLog("Vote for proposal " + votedProposalID + " registered");
    }
  }

  return (
    <section className="votes">
      <h3>Votes</h3>
      <div>
        <label htmlFor="voteProposalId">Vote for a proposal : </label>
        <input type="text" id="voteProposalId" name="voteProposalId" placeholder="Proposal ID" onChange={handleIDChange} value={proposalIDToVote} autoComplete="off" />
        <button onClick={voteProposalId}>Submit vote</button>
      </div>
      <div>
        <span>Logs : {voteLog}</span>
      </div>
    </section>
  );
}

export default Votes;
