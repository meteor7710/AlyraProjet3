import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Owner from "./Owner";
import Voter from "./Voter";
import Result from "./Result";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import { Text, Box, Container } from '@chakra-ui/react';

function Voting() {
  const { state } = useEth();
  const { state: { accounts } } = useEth();
  const [addressToWhitelistLog, setAddressToWhitelistLog] = useState("");
  const [workflowStatusLog, setWorkflowStatusLog] = useState("");
  const [currentWorkflowStatus, setCurrentWorkflowStatus] = useState();
  const [currentAddress, setCurrentAddress] = useState("");

  useEffect(() => {
    (async function () {
      if (accounts) {
        setCurrentAddress(accounts[0])
      }
    })();
  }, [accounts])

  const voting =
    <>
      <Owner addressToWhitelistLog={addressToWhitelistLog} setAddressToWhitelistLog={setAddressToWhitelistLog} workflowStatusLog={workflowStatusLog} setWorkflowStatusLog={setWorkflowStatusLog} currentWorkflowStatus={currentWorkflowStatus} setCurrentWorkflowStatus={setCurrentWorkflowStatus} />
      <Voter addressToWhitelistLog={addressToWhitelistLog} currentWorkflowStatus={currentWorkflowStatus} />
      <Result currentWorkflowStatus={currentWorkflowStatus} />
    </>;

  return (
    <div>
      <Title />
      <Text fontSize='lg'>Current Address : {currentAddress}</Text>
      <Container maxW="4xl">
        {
          !state.artifact ? <NoticeNoArtifact /> :
            !state.contract ? <NoticeWrongNetwork /> :
              <Box>{voting}</Box>
        }
      </Container>
      <Footer />
    </div>
  );
}

export default Voting;
