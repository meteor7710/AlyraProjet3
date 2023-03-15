import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Proposals({addProposalLog}) {
  const { state: { contract, accounts, creationBlock } } = useEth();

  const [proposalsInformations, setProposalsInformations] = useState([]);

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
