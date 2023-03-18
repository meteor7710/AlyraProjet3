import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { useDisclosure, Alert, AlertIcon, AlertDialog, AlertDialogFooter, AlertDialogOverlay, AlertDialogContent, AlertDialogBody, Heading, Input, Button, FormControl, Flex, Box, Th, Tr, Td, Thead, Tbody, Spacer, Table, TableContainer, TableCaption } from '@chakra-ui/react';

function VoterInformations() {

  const { state: { contract, accounts, web3 } } = useEth();
  const [voterAddressToQuery, setVoterAddressToQuery] = useState("");
  const [voterHistory, setVoterHistory] = useState([]);
  const [voterInformations, setVoterInformations] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure()

  //Manage address input
  const handleAdressToQueryChange = e => {
    setVoterAddressToQuery(e.target.value);
  }

  //Reset votes informations table
  const resetVoterHistory = async () => {
    setVoterHistory("");
    setVoterInformations([]);
  };

  //Get voter informations from an address
  const getVoterInformation = async () => {
    if (!web3.utils.isAddress(voterAddressToQuery)) { onOpen(); return; }

    const voterReturns = await contract.methods.getVoter(voterAddressToQuery).call({ from: accounts[0] });

    let voterDisplay = [];

    voterDisplay = Array.from(voterHistory);

    voterDisplay.push(
      {
        address: voterAddressToQuery,
        isRegistered: voterReturns.isRegistered.toString(),
        hasVoted: voterReturns.hasVoted.toString(),
        votedProposalId: voterReturns.votedProposalId
      }
    )

    //manage voters information request history
    setVoterHistory(voterDisplay);

    const voterRendered = voterDisplay.map((user, index) =>
      <Tr key={"voter" + index}>
        <Td>{user.address}</Td>
        <Td>{user.isRegistered}</Td>
        <Td>{user.hasVoted}</Td>
        <Td>{user.votedProposalId}</Td>
      </Tr>
    );

    setVoterAddressToQuery("");
    setVoterInformations(voterRendered);
  };

  return (
    <section className="voterInformations">
      <Box my="10px" p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
        <Heading as='h3' size='lg'>Get voter informations</Heading>
        <Box m="25px" >
          <FormControl >
            <Flex>
              <Spacer />
              <Input width='400px' type='text' placeholder="Add voter address" onChange={handleAdressToQueryChange} value={voterAddressToQuery} autoComplete="off" />
              <Spacer />
              <Button colorScheme='gray' onClick={getVoterInformation}>Get informations</Button>
              <Spacer />
              <Button colorScheme='gray' onClick={resetVoterHistory}>Clean informations</Button>
              <Spacer />
            </Flex>
          </FormControl>
        </Box>
        <TableContainer maxHeight="380px" overflowY="auto">
          <Table>
            <TableCaption>Voters informations</TableCaption>
            <Thead>
              <Tr>
                <Th>Address</Th>
                <Th>Is Registered</Th>
                <Th>Has voted</Th>
                <Th>Voted proposal ID</Th>
              </Tr>
            </Thead>
            <Tbody>{voterInformations}</Tbody>
          </Table>
        </TableContainer>
      </Box>
      <AlertDialog isOpen={isOpen} onClose={onClose} >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody>
              <Alert width="auto" status='error' borderRadius='5px'> <AlertIcon />Address submitted is invalid.</Alert>
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

export default VoterInformations;
