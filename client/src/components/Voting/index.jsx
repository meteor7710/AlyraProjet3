import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Owner from "./Owner";
import Voter from "./Voter";
import Result from "./Result";
import { useState, useEffect } from "react";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Voting() {
  const { state, contract, accounts } = useEth();
  const [addressToWhitelistLog, setAddressToWhitelistLog]= useState();
  const [workflowStatusLog, setWorkflowStatusLog] = useState();
  const [currentWorkflowStatus, setCurrentWorkflowStatus] = useState();

    //Show current status
    useEffect(() => {
      (async function () {
        const workflowStatus= await contract.methods.workflowStatus().call();
        setCurrentWorkflowStatus(workflowStatus);
      })();
    }, [contract,accounts,workflowStatusLog])

  const voting =
    <>
      <div className="contract-container">
        <Owner addressToWhitelistLog={addressToWhitelistLog} setAddressToWhitelistLog={setAddressToWhitelistLog} workflowStatusLog={workflowStatusLog} setWorkflowStatusLog={setWorkflowStatusLog} currentWorkflowStatus={currentWorkflowStatus}/>
        <Voter addressToWhitelistLog={addressToWhitelistLog}/>        
        <Result />
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
