import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Owner from "./Owner";
import Voter from "./Voter";
import Result from "./Result";
import { useState, useEffect } from "react";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import { Text } from '@chakra-ui/react'

function Voting() {
  const { state } = useEth();
  const { state: { accounts } } = useEth();
  const [addressToWhitelistLog, setAddressToWhitelistLog]= useState("");
  const [workflowStatusLog, setWorkflowStatusLog] = useState();
  const [currentWorkflowStatus, setCurrentWorkflowStatus] = useState();
  const [currentAddress, setCurrentAddress] = useState();

  useEffect(() => {
    (async function () {
      setCurrentAddress(accounts[0])
    })();
  }, [accounts])


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
      <Text fontSize='lg'>Current Address : {currentAddress}</Text>
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
          voting
      }
    </div>
  );
}

export default Voting;
