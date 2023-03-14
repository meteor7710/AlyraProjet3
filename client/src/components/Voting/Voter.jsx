import Proposals from "./Proposals";
import Votes from "./Votes";
import ProposalInformations from "./ProposalInformations"
import VoterInformations from "./VoterInformations"
import useEth from "../../contexts/EthContext/useEth";
import { useState, useEffect } from "react";

function Voter({addressToWhitelistLog}) {
    const { state: {  contract, accounts } } = useEth();

    const voterTools =
        <>
            <Proposals />
            <hr />
            <Votes />
            <hr />
            <VoterInformations />
            <hr />
            <ProposalInformations />
            <hr />
        </>;

const [addressIsVoter, setAddressIsVoter] = useState(false);

//show address already whitelisted
useEffect(() => {
    (async function () {
        const voters = await contract.getPastEvents("VoterRegistered", { fromBlock: 0, toBlock: "latest" });
        const findVoter =  voters.find((address) => address.returnValues.voterAddress === accounts[0]);

        if (findVoter) {setAddressIsVoter(true);}
      
    })();
  }, [contract,accounts,addressToWhitelistLog])

    return (
        <div className="Voter">
            {
                (addressIsVoter) ? voterTools :
                    <span></span>
            }
        </div>
    );
}

export default Voter;