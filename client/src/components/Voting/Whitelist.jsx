import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Heading, Box, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react';

function Whitelist({ addressToWhitelistLog }) {
  const { state: { contract, accounts, creationBlock } } = useEth();
  const [registeredAddresses, setRegisteredAddresses] = useState();

  //Get address already whitelisted
  useEffect(() => {
    (async function () {
      const voterRegisteredEvents = await contract.getPastEvents('VoterRegistered', { fromBlock: creationBlock, toBlock: 'latest' });
      const voterAddresses = [];

      for (let i = 0; i < voterRegisteredEvents.length; i++) {
        voterAddresses.push(
          {
            blockNumber: voterRegisteredEvents[i].blockNumber,
            voterAddress: voterRegisteredEvents[i].returnValues.voterAddress,
          });
      };

      //Build table body of registered address
      const listAdresses = voterAddresses.map((add, index) =>
        <Tr key={"add" + index}>
          <Td>{add.blockNumber}</Td>
          <Td>{add.voterAddress}</Td>
        </Tr>
      );

      setRegisteredAddresses(listAdresses);

    })();
  }, [contract, accounts, creationBlock, addressToWhitelistLog])

  return (
    <section className="whitelist">
      <Box p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
        <Heading as='h3' size='lg'>Whitelist</Heading>
        <TableContainer maxheight="380px" overflowY="auto">
          <Table>
            <TableCaption>Whitelisted adresses</TableCaption>
            <Thead>
              <Tr>
                <Th>Registration Block Number</Th>
                <Th>Address</Th>
              </Tr>
            </Thead>
            <Tbody>{registeredAddresses}</Tbody>
          </Table>
        </TableContainer>
      </Box>
    </section>
  );
}

export default Whitelist;
