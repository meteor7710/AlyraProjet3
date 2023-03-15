import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Whitelist({addressToWhitelistLog}) {
  const { state: { contract, accounts, creationBlock } } = useEth();
  const [registeredAddresses, setRegisteredAddresses] = useState();

  //show address already whitelisted
  useEffect(() => {
    (async function () {
      const voterRegisteredEvents= await contract.getPastEvents('VoterRegistered', {fromBlock: creationBlock,toBlock: 'latest'});
      const voterAddresses=[];

      voterRegisteredEvents.forEach(event => {
        voterAddresses.push(event.returnValues.voterAddress);
      });

      //Build a list of <li>address</li>
      const listAdresses = voterAddresses.map((address,index) => <li key={"add"+index}>{address}</li>);
      setRegisteredAddresses(listAdresses);
    })();
  }, [contract,accounts,creationBlock,addressToWhitelistLog])



  return (
    <section className="whitelist">
      <h3>Whitelist</h3>
      <div>
        <span>Address whitelisted :</span>
        <ul>{registeredAddresses}</ul>
      </div>
    </section>
  );
}

export default Whitelist;
