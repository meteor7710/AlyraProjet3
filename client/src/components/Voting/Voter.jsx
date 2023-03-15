import Proposals from "./Proposals";
import Votes from "./Votes";
import VotesClosed from "./VotesClosed";
import VotesNotOpened from "./VotesNotOpened";
import ProposalInformations from "./ProposalInformations"
import VoterInformations from "./VoterInformations"
import useEth from "../../contexts/EthContext/useEth";
import ProposalRegistration from "./ProposalRegistration";
import ProposalRegistrationClosed from "./ProposalRegistrationClosed";
import ProposalRegistrationNotOpened from "./ProposalRegistrationNotOpened";
import { useState, useEffect } from "react";

function Voter({addressToWhitelistLog,currentWorkflowStatus}) {
    const { state: {  contract, accounts } } = useEth();
    const [addProposalLog, setAddProposalLog]= useState();

    const voterTools =
        <>
            {
                (currentWorkflowStatus === "0")  ? <ProposalRegistrationNotOpened /> :
                (currentWorkflowStatus === "1")  ? <ProposalRegistration  addProposalLog={addProposalLog}  setAddProposalLog={setAddProposalLog}/> :
                <ProposalRegistrationClosed />
            }
            <hr/>
            <Proposals addProposalLog={addProposalLog}/>
            <hr />
            {
                (currentWorkflowStatus < "3")  ? <VotesNotOpened /> :
                (currentWorkflowStatus === "3")  ? <Votes/> :
                <VotesClosed />
            }
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