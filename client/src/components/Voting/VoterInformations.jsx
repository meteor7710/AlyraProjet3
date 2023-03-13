import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function VoterInformations() {

  const { state: { contract, accounts, web3 } } = useEth();
  const [voterAddressToQuery, setVoterAddressToQuery] = useState("");
  const [voterHistory, setVoterHistory] = useState([]);
  const [voterInformations, setVoterInformations] = useState([]);

  //Manage address input
  const handleAdressToQueryChange = e => {
    setVoterAddressToQuery(e.target.value);
  }

  //Reset votes informations table
  const resetVoterHistory = async () => {
    setVoterHistory("");
    setVoterInformations([]);
  };

  //Get voter informations from an address
  const getVoterInformation = async () => {
    if (!web3.utils.isAddress(voterAddressToQuery)) {alert("invalid address"); }
    
    const voterReturns = await contract.methods.getVoter(voterAddressToQuery).call({ from: accounts[0] });

    let voterDisplay = [];

    voterDisplay = Array.from(voterHistory);

    voterDisplay.push(
      {
        address: voterAddressToQuery,
        isRegistered: voterReturns.isRegistered.toString(),
        hasVoted: voterReturns.hasVoted.toString(),
        votedProposalId: voterReturns.votedProposalId
      }
    )
    
    //manage voters information request history
    setVoterHistory(voterDisplay);

    const voterRendered = voterDisplay.map((user,index) => 
      <tr key={"voter"+index}>
        <td>{user.address}</td>
        <td>{user.isRegistered}</td>
        <td>{user.hasVoted}</td>
        <td>{user.votedProposalId}</td>
      </tr>
    );

    setVoterInformations(voterRendered); 
  };

  return (
    <div className="voterInformations">
      <h3>Voter Informations</h3>
      <div>
        <label htmlFor="voterInformation">Get voter informations : </label>
        <input type="text" id="voterInformation" name="voterInformation" placeholder="Add voter address" onChange={handleAdressToQueryChange} value={voterAddressToQuery}  autoComplete="off"/>
        <button onClick={getVoterInformation}>Get informations</button>
        <button onClick={resetVoterHistory}>Clean informations</button>
      </div>
      <div>
        <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Is Registered</th>
                <th>Has voted</th>
                <th>Voted proposal ID</th>
              </tr>
            </thead>
            <tbody>{voterInformations}</tbody>
        </table>
      </div>
    </div>
  );
}

export default VoterInformations;
