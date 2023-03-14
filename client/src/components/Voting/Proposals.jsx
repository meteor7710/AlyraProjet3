import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Proposals(proposals) {
  const { state: { contract, accounts, artifact } } = useEth();
  const [proposalsData, setProposalsData] = useState([]);
  const [inputValue, setInput]= useState("");

  useEffect(() => {
    async function getProposals() {
      if (contract) {
        //Récupération des propositions à partir de l'event
        const proposalEvent = await contract.getPastEvents("ProposalRegistered", { fromBlock: 0, toBlock: "latest" });
        // Création d'un tableau pour les référencer
        const proposalsId = proposalEvent.map((proposal) => proposal.returnValues._proposalId);
        let proposalsDatas = [];

        // Boucle d'enregistrement de propositions
        for (const id of proposalsId) {
          // Récupération des données de la proposition
          const proposal = await contract.methods.getOneProposal(parseInt(id)).call({ from: accounts[0] });
          // Remplissage le tableau
          proposalsDatas.push(
            {
              id: id,
              desccription: proposal.description,
              voteCount: proposal.voteCount
            }
          );
        }
         // Mémorisation dans le state
        setProposalsData(proposalsDatas);
      }
    };
  
    getProposals();
  }, [accounts, contract, artifact]);

  const handleChange = (event) => {
    setInput(event.currentTarget.value);
  };

  const handleAddProposal = async () => {
    if (inputValue === "") {
      alert("Please, enter a description");
      return;
    }
    const receipt = await contract.methods.addProposal(inputValue).send({ from: accounts[0] });
    window.location.reload();
  };
  

  return (
    <section>
      <div className="proposals">
      <h3>Proposals</h3>
      

        <div>
          <h4>Proposals List</h4>
          <table>
            <thead>
             <tr>
                <th>Description</th>
                <th>Vote count</th>
              </tr>
            </thead>

            <tbody>
              {proposalsData.map((proposal) => {
               return (
                  <tr key={proposal.id}>
                    <td>{proposal.desc}</td>
                    <td>{proposal.voteCount}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        
      
        </div>
        <div>
          <form onSubmit={handleAddProposal}>
            <datalist>
                <input
                  value={inputValue}
                  onChange={handleChange}
                  placeholder="Add Proposal"
                  size="huge"
                />
            </datalist>
            <button color="blue" type="submit" size="huge">
              Add
            </button>
          </form>
        </div>
    
      </div>
    </section>
    
    
  );
}

export default Proposals;
