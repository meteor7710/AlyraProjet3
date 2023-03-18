import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Heading, Box, Text, Button, Alert, AlertIcon, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Flex, Center } from '@chakra-ui/react';

function States({ workflowStatusLog, setWorkflowStatusLog, currentWorkflowStatus, setCurrentWorkflowStatus }) {
  const { state: { contract, accounts, creationBlock } } = useEth();
  const [workflowEvents, setWorkflowEvents] = useState();

  //Show current status
  useEffect(() => {
    (async function () {
      const workflowStatus = await contract.methods.workflowStatus().call();
      setCurrentWorkflowStatus(workflowStatus);
    })();
  }, [contract, accounts, setCurrentWorkflowStatus, workflowStatusLog])

  //show status event history
  useEffect(() => {
    (async function () {
      const workflowStatusEvents = await contract.getPastEvents('WorkflowStatusChange', { fromBlock: creationBlock, toBlock: 'latest' });

      const workflowChanges = [];

      for (let i = 0; i < workflowStatusEvents.length; i++) {
        workflowChanges.push(
          {
            blockNumber: workflowStatusEvents[i].blockNumber,
            previousStatus: workflowStatusEvents[i].returnValues.previousStatus,
            newStatus: workflowStatusEvents[i].returnValues.newStatus,
          });
      };

      //Build table body of registered address
      const listWorkflowChanges = workflowChanges.map((status, index) =>
        <Tr key={"status" + index}>
          <Td>{status.blockNumber}</Td>
          <Td>{status.previousStatus}</Td>
          <Td>{status.newStatus}</Td>
        </Tr>
      );

      setWorkflowEvents(listWorkflowChanges);
    })();
  }, [contract, creationBlock, workflowStatusLog])

  //Change workflowstatus to ProposalsRegistrationStarted
  const startProposals = async () => {
    if (await contract.methods.startProposalsRegistering().call({ from: accounts[0] })) {
      const workflowStatusTx = await contract.methods.startProposalsRegistering().send({ from: accounts[0] })

      const workflowPreviousStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.previousStatus;
      const workflowNewStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.newStatus;

      setWorkflowStatusLog("Change workflow status from " + workflowPreviousStatus + " to " + workflowNewStatus);
    }
  };

  //Change workflowstatus to ProposalsRegistrationEnded
  const endProposals = async () => {
    if (await contract.methods.endProposalsRegistering().call({ from: accounts[0] })) {
      const workflowStatusTx = await contract.methods.endProposalsRegistering().send({ from: accounts[0] })

      const workflowPreviousStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.previousStatus;
      const workflowNewStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.newStatus;

      setWorkflowStatusLog("Change status from " + workflowPreviousStatus + " to " + workflowNewStatus);
    }
  };

  //Change workflowstatus to VotingSessionStarted
  const startVoting = async () => {
    if (await contract.methods.startVotingSession().call({ from: accounts[0] })) {
      const workflowStatusTx = await contract.methods.startVotingSession().send({ from: accounts[0] })

      const workflowPreviousStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.previousStatus;
      const workflowNewStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.newStatus;

      setWorkflowStatusLog("Change status from " + workflowPreviousStatus + " to " + workflowNewStatus);
    }
  };

  //Change workflowstatus to VotingSessionEnded
  const endVoting = async () => {
    if (await contract.methods.endVotingSession().call({ from: accounts[0] })) {
      const workflowStatusTx = await contract.methods.endVotingSession().send({ from: accounts[0] })

      const workflowPreviousStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.previousStatus;
      const workflowNewStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.newStatus;

      setWorkflowStatusLog("Change status from " + workflowPreviousStatus + " to " + workflowNewStatus);
    }
  };

  //Change workflowstatus to VotesTallied
  const tallyVotes = async () => {

    if (await contract.methods.tallyVotes().call({ from: accounts[0] })) {
      const workflowStatusTx = await contract.methods.tallyVotes().send({ from: accounts[0] })

      const workflowPreviousStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.previousStatus;
      const workflowNewStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.newStatus;

      setWorkflowStatusLog("Change status from " + workflowPreviousStatus + " to " + workflowNewStatus);
    }
  };

  return (
    <section className="states">
      <Box p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
        <Heading as='h3' size='lg'>States</Heading>
        <Text m="25px">Current workflow status : {currentWorkflowStatus}</Text>
        <Box m="25px">
          <Flex>
            <Text my="25px">Change workflow status actions :</Text>
            <Center mx="25px">
              {
                (currentWorkflowStatus === "0") ? <Button colorScheme='gray' onClick={startProposals}>Start propossals registration</Button> :
                  (currentWorkflowStatus === "1") ? <Button colorScheme='gray' onClick={endProposals}>End propossals registration</Button> :
                    (currentWorkflowStatus === "2") ? <Button colorScheme='gray' onClick={startVoting}>Start voting session</Button> :
                      (currentWorkflowStatus === "3") ? <Button colorScheme='gray' onClick={endVoting}>End voting session</Button> :
                        (currentWorkflowStatus === "4") ? <Button colorScheme='gray' onClick={tallyVotes}>Tally votes</Button> :
                          <Alert status='warning' borderRadius='5px'> <AlertIcon />Vote Session Finished</Alert>
              }
            </Center>
          </Flex>
        </Box>
        <Box>
          {(workflowStatusLog !== "") ? (<Alert width="auto" status='success' borderRadius='5px'> <AlertIcon /> {workflowStatusLog} </Alert>) :
            <Text></Text>}
        </Box>
        <TableContainer>
          <Table>
            <TableCaption>Workflows status history</TableCaption>
            <Thead>
              <Tr>
                <Th>Registration Block Number</Th>
                <Th>Previous Status</Th>
                <Th>Next Status</Th>
              </Tr>
            </Thead>
            <Tbody>{workflowEvents}</Tbody>
          </Table>
        </TableContainer>
      </Box>
    </section>
  );
}

export default States;
