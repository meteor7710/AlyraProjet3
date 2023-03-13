import Proposals from "./Proposals";
import Votes from "./Votes";
import ProposalInformations from "./ProposalInformations"
import VoterInformations from "./VoterInformations"
import useEth from "../../contexts/EthContext/useEth";

function Voter() {
    const { state: { isVoter } } = useEth();

    const ownerTools =
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

    return (
        <div className="Voter">
            {
                (isVoter) ? ownerTools :
                    <span></span>
            }
        </div>
    );
}

export default Voter;