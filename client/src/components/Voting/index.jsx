import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Whitelist from "./Whitelist";
import States from "./States";
import Proposals from "./Proposals";
import Votes from "./Votes";
import Result from "./Result";
import VoterInformations from "./VoterInformations"
import ProposalInformations from "./ProposalInformations"
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Voting() {
  const { state } = useEth();

  const voting =
    <>
      <div className="contract-container">
        <Whitelist />
        <hr/>
        <States />
        <hr/>
        <Proposals />
        <hr/>
        <Votes />
        <hr/>
        <Result />
        <hr/>
        <VoterInformations />
        <hr/>
        <ProposalInformations />
      </div>
    </>;

  return (
    <div className="demo">
      <Title />
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
          voting
      }
    </div>
  );
}

export default Voting;
