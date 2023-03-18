import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { useDisclosure, Alert, AlertIcon, AlertDialog, AlertDialogFooter, AlertDialogOverlay, AlertDialogContent, AlertDialogBody, Heading, Input, Button, FormControl, Flex, Box, Th, Tr, Td, Thead, Tbody, Spacer, Table, TableContainer, TableCaption } from '@chakra-ui/react';

function ProposalInformations() {

  const { state: { contract, accounts, creationBlock } } = useEth();
  const [proposalIDToQuery, setProposalIDToQuery] = useState("");
  const [proposalHistory, setProposalHistory] = useState([]);
  const [proposalInformations, setProposalInformations] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();


  //Manage proposal input. It can only be interger
  const handleIDChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setProposalIDToQuery(e.target.value);
    }
  };

  //Reset proposals informations table
  const resetProposalHistory = async () => {
    setProposalHistory("");
    setProposalInformations([]);
  };

  //Get proposal informations from an ID
  const getProposalInformation = async () => {

    //Validate proposal ID
    if (proposalIDToQuery === "") { setErrorMsg("Proposal ID must be not null"); onOpen(); return; }
    if (proposalIDToQuery === "0") { setErrorMsg("Proposal ID must be not 0"); onOpen(); setProposalIDToQuery(""); return; }
    const proposalRegisteredEvents = await contract.getPastEvents('ProposalRegistered', { fromBlock: creationBlock, toBlock: 'latest' });
    if (proposalIDToQuery > proposalRegisteredEvents.length) { setErrorMsg("Proposal ID must be lower or equal than " + proposalRegisteredEvents.length); onOpen(); setProposalIDToQuery(""); return; }

    const proposalReturns = await contract.methods.getOneProposal(proposalIDToQuery).call({ from: accounts[0] });

    let proposalDisplay = [];

    proposalDisplay = Array.from(proposalHistory);

    proposalDisplay.push(
      {
        id: proposalIDToQuery,
        description: proposalReturns.description.toString(),
        voteCount: proposalReturns.voteCount.toString(),
      }
    )

    //manage proposals informations request history
    setProposalHistory(proposalDisplay);

    const proposalRendered = proposalDisplay.map((prop, index) =>
      <Tr key={"prop" + index}>
        <Td>{prop.id}</Td>
        <Td>{prop.description}</Td>
        <Td>{prop.voteCount}</Td>
      </Tr>
    );
    setProposalIDToQuery("");
    setProposalInformations(proposalRendered);
  };

  return (
    <section className="proposalInformations">
      <Box my="10px" p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
        <Heading as='h3' size='lg'>Get proposal informations</Heading>
        <Box m="25px" >
          <FormControl >
            <Flex>
              <Spacer />
              <Input width='400px' type='text' placeholder="Add proposal ID" onChange={handleIDChange} value={proposalIDToQuery} autoComplete="off" />
              <Spacer />
              <Button colorScheme='gray' onClick={getProposalInformation}>Get informations</Button>
              <Spacer />
              <Button colorScheme='gray' onClick={resetProposalHistory}>Clean informations</Button>
              <Spacer />
            </Flex>
          </FormControl>
        </Box>
        <TableContainer maxHeight="380px" overflowY="auto">
          <Table>
            <TableCaption>Proposals informations</TableCaption>
            <Thead>
              <Tr>
                <Th>Proposal ID</Th>
                <Th>Proposal description</Th>
                <Th>Proposal vote count</Th>
              </Tr>
            </Thead>
            <Tbody>{proposalInformations}</Tbody>
          </Table>
        </TableContainer>
      </Box>
      <AlertDialog isOpen={isOpen} onClose={onClose} >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody>
              <Alert width="auto" status='error' borderRadius='5px'> <AlertIcon />{errorMsg}</Alert>
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

export default ProposalInformations;
