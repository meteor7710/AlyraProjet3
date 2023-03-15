import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Whitelist({addressToWhitelistLog}) {
  const { state: { contract, accounts, creationBlock } } = useEth();
  const [registeredAddresses, setRegisteredAddresses] = useState();

  //Get address already whitelisted
  useEffect(() => {
    (async function () {
      const voterRegisteredEvents= await contract.getPastEvents('VoterRegistered', {fromBlock: creationBlock,toBlock: 'latest'});
      const voterAddresses=[];

      console.log ("voterRegisteredEvents");
      console.log(voterRegisteredEvents);

      for (let i=0; i < voterRegisteredEvents.length ; i++)
      {
        voterAddresses.push(
          {
            blockNumber: voterRegisteredEvents[i].blockNumber,
            voterAddress: voterRegisteredEvents[i].returnValues.voterAddress,
          });
      };

      //Build table body of registered address
      const listAdresses = voterAddresses.map((add,index) => 
        <tr key={"add"+index}>
          <td>{add.blockNumber}</td>
          <td>{add.voterAddress}</td>
        </tr>
      );

      setRegisteredAddresses(listAdresses);

    })();
  }, [contract,accounts,creationBlock,addressToWhitelistLog])



  return (
    <section className="whitelist">
      <h3>Whitelist</h3>
      <div>
          <table>
              <thead>
                <tr>
                  <th>Registration BlockNumber</th>
                  <th>Address whitelisted</th>
                </tr>
              </thead>
            <tbody>{registeredAddresses}</tbody>
          </table>
        </div>
    </section>
  );
}

export default Whitelist;
