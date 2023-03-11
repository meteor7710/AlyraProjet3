import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Whitelist() {
  const { state: { contract, accounts, web3 } } = useEth();
  const [addressToWhitelist, setAddressToWhitelist]= useState("");
  const [addressToWhitelistLog, setAddressToWhitelistLog]= useState("");
  const [registeredAddresses, setRegisteredAddresses] = useState();

  //show address already whitelisted
  useEffect(() => {
    (async function () {
      const voterRegisteredEvents= await contract.getPastEvents('VoterRegistered', {fromBlock: 0,toBlock: 'latest'});
      const voterAddresses=[];

      voterRegisteredEvents.forEach(event => {
        voterAddresses.push(event.returnValues.voterAddress);
      });

      //Build a list of <li>address</li>
      const listAdresses = voterAddresses.map((address,index) => <li key={"add"+index}>{address}</li>);
      setRegisteredAddresses(listAdresses);
 
    })();
  }, [contract,addressToWhitelistLog])

  //Manage address input
  const handleAdressChange = e => {
    setAddressToWhitelist(e.target.value);
  }; 

  //Add address to whitelist
  const addAddressToWhitelist = async () => {
    if (!web3.utils.isAddress(addressToWhitelist)) {alert("invalid address"); }

    if (await contract.methods.addVoter(addressToWhitelist).call({ from: accounts[0] })){
      const addAddressTx = await contract.methods.addVoter(addressToWhitelist).send({ from: accounts[0] });
      
      const addedAddressToWhitelist = addAddressTx.events.VoterRegistered.returnValues.voterAddress;
      setAddressToWhitelistLog ("Address added to the Whitelist : " + addedAddressToWhitelist);
    }
  };

  return (
    <div className="whitelist">
      <h3>Whitelist</h3>
      <div>
        <span>Add address to whitelist : </span>
        <input type="text" id="addAddress" name="addAddress" placeholder="Add address to whitelist" onChange={handleAdressChange} value={addressToWhitelist} autoComplete="off"/>
        <button onClick={addAddressToWhitelist}>Add address</button>
      </div>
      <div>
        <span>Logs :</span><span>{addressToWhitelistLog}</span>
      </div>

      <div>
        <span>Address already whitelisted :</span>
        <ul>{registeredAddresses}</ul>
      </div>
    </div>
  );
}

export default Whitelist;
