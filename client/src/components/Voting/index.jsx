import useEth from "../../contexts/EthContext/useEth";
import Title from "./AddressConnected";
import Owner from "./Owner";
import Voter from "./Voter";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import { Box, Container } from '@chakra-ui/react';

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
    </>;

  return (
    <div>
      <Container maxW="4xl">
      <Title currentAddress={currentAddress}/>
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
