import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";
import { Heading, Input, Button, FormControl, FormLabel, Text, Box, Alert, AlertIcon, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogContent, AlertDialogOverlay, useDisclosure, Flex, Spacer, Center } from '@chakra-ui/react';

function Votes() {
  const { state: { accounts, contract, creationBlock } } = useEth();
  const [voteLog, setVoteLog] = useState("");
  const [proposalIDToVote, setProposalIDToVote] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMsg, setErrorMsg] = useState("");

  //Clean log when we change user
  useEffect(() => {
    (async function () {
      setVoteLog("");
      setProposalIDToVote("");
    })();
  }, [accounts])

  //Manage proposal input. It can only be interger
  const handleIDChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setProposalIDToVote(e.target.value);
    }
  };

  //Submit to contract
  const voteProposalId = async () => {

    //Validate proposal ID
    if (proposalIDToVote === "") { setErrorMsg("Proposal ID must be not null"); onOpen(); return; }
    if (proposalIDToVote === "0") { setErrorMsg("Proposal ID must be not 0"); onOpen(); setProposalIDToVote(""); return; }
    const proposalRegisteredEvents = await contract.getPastEvents('ProposalRegistered', { fromBlock: creationBlock, toBlock: 'latest' });
    if (proposalIDToVote > proposalRegisteredEvents.length) { setErrorMsg("Proposal ID must be lower or equal than " + proposalRegisteredEvents.length); onOpen(); setProposalIDToVote(""); return; }

    //Validate user has not already voted
    const voterReturns = await contract.methods.getVoter(accounts[0]).call({ from: accounts[0] });
    if (voterReturns.hasVoted) { setErrorMsg("You have already voted"); onOpen(); setProposalIDToVote(""); return; }

    if (await contract.methods.setVote(proposalIDToVote).call({ from: accounts[0] })) {
      const setVoteTx = await contract.methods.setVote(proposalIDToVote).send({ from: accounts[0] });

      const votedProposalID = setVoteTx.events.Voted.returnValues.proposalId;
      setVoteLog("Vote for proposal " + votedProposalID + " registered");
      setProposalIDToVote("");
    }
  }

  return (
    <section className="votes">
      <Box my="10px" p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
        <Heading as='h3' size='lg'>Votes</Heading>
        <Box m="25px" >
          <FormControl >
            <Flex>
              <Spacer />
              <Center>
                <FormLabel>Vote for a proposal :</FormLabel>
              </Center>
              <Spacer />
              <Input width='400px' type='text' placeholder="Proposal ID" onChange={handleIDChange} value={proposalIDToVote} autoComplete="off" />
              <Spacer />
              <Button colorScheme='gray' onClick={voteProposalId}>Submit vote</Button>
              <Spacer />
            </Flex>
          </FormControl>
        </Box>
        <Box>
          {(voteLog !== "") ? (<Alert width="auto" status='success' borderRadius='25px'> <AlertIcon /> {voteLog} </Alert>) :
            <Text></Text>}
        </Box>

      </Box>
      <AlertDialog isOpen={isOpen} onClose={onClose} >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody>
              <Alert width="auto" status='error' borderRadius='25px'> <AlertIcon />{errorMsg}</Alert>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>Close</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </section>
  );
}

export default Votes;
