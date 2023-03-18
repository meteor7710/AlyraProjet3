import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Heading, Textarea, Button, FormControl, FormLabel, Text, Box, Alert, AlertIcon, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogContent, AlertDialogOverlay, useDisclosure, Flex, Spacer } from '@chakra-ui/react';

function ProposalRegistration({ addProposalLog, setAddProposalLog }) {
  const { state: { contract, accounts } } = useEth();
  const [proposalToAdd, setProposalToAdd] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()

  //Manage Proposal input
  const handleProposalChange = e => {
    setProposalToAdd(e.target.value);
  };

  //Add Proposal
  const addProposal = async () => {
    if (proposalToAdd === "") { onOpen(); return; }

    if (await contract.methods.addProposal(proposalToAdd).call({ from: accounts[0] })) {
      const addProposalTx = await contract.methods.addProposal(proposalToAdd).send({ from: accounts[0] });

      const addedProposalId = addProposalTx.events.ProposalRegistered.returnValues.proposalId;
      setAddProposalLog("Proposal " + addedProposalId + " registered");
    }
  };

  return (
    <section className="proposalRegistration">
      <Box p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
        <Heading as='h3' size='lg'>Proposal Registration</Heading>
        <Box m="25px" >
          <FormControl >
            <Flex>
              <Spacer />
              <FormLabel>Add a proposal :</FormLabel>
              <Spacer />
              <Textarea width='400px' type='text' placeholder="Proposal description" onChange={handleProposalChange} value={proposalToAdd} autoComplete="off" />
              <Spacer />
              <Button colorScheme='gray' onClick={addProposal}>Add proposal</Button>
              <Spacer />
            </Flex>
          </FormControl>
        </Box>
        <Box>
          {(addProposalLog !== "") ? (<Alert width="auto" status='success' borderRadius='5px'> <AlertIcon /> {addProposalLog} </Alert>) :
            <Text></Text>}
        </Box>
      </Box>
      <AlertDialog isOpen={isOpen} onClose={onClose} >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody>
              <Alert width="auto" status='error' borderRadius='5px'> <AlertIcon />Proposal description can't be null.</Alert>
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

export default ProposalRegistration;