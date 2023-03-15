import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Owner from "./Owner";
import Voter from "./Voter";
import Result from "./Result";
import { useState } from "react";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Voting() {
  const { state } = useEth();
  const [addressToWhitelistLog, setAddressToWhitelistLog]= useState();
  const [workflowStatusLog, setWorkflowStatusLog] = useState();
  const [currentWorkflowStatus, setCurrentWorkflowStatus] = useState();

  const voting =
    <>
      <div className="contract-container">
        <Owner addressToWhitelistLog={addressToWhitelistLog} setAddressToWhitelistLog={setAddressToWhitelistLog} workflowStatusLog={workflowStatusLog} setWorkflowStatusLog={setWorkflowStatusLog} currentWorkflowStatus={currentWorkflowStatus} setCurrentWorkflowStatus={setCurrentWorkflowStatus}/>
        <Voter addressToWhitelistLog={addressToWhitelistLog} currentWorkflowStatus={currentWorkflowStatus}/>        
        <Result currentWorkflowStatus={currentWorkflowStatus}/>
      </div>
    </>;

  return (
    <div className="voting">
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
