import { Box, Table, TableCaption, TableContainer, Tbody, Thead, Td, Tr, Th, Heading } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Proposals({ addProposalLog }) {
  const { state: { contract, accounts, creationBlock } } = useEth();

  const [proposalsInformations, setProposalsInformations] = useState([]);

  //show proposal already registered
  useEffect(() => {
    (async function () {

      //Get proposal information from a proposal ID
      async function getProposalInformations(proposalId) {
        let proposal = [];
        proposal = await contract.methods.getOneProposal(parseInt(proposalId)).call({ from: accounts[0] });
        return proposal;
      };

      const proposalRegisteredEvents = await contract.getPastEvents('ProposalRegistered', { fromBlock: creationBlock, toBlock: 'latest' });
      const proposalsList = [];

      for (let i = 0; i < proposalRegisteredEvents.length; i++) {
        let proposal = [];
        proposal = await getProposalInformations(i + 1);

        proposalsList.push(
          {
            id: proposalRegisteredEvents[i].returnValues.proposalId,
            description: proposal.description,
          });
      };

      const listProposal = proposalsList.map((prop, index) =>
        <Tr key={"proposal" + index}>
          <Td>{prop.id}</Td>
          <Td>{prop.description}</Td>
        </Tr>
      );
      setProposalsInformations(listProposal);
    })();
  }, [contract, accounts, creationBlock, addProposalLog])

  return (
    <section className="proposals">
      <Box my="10px" p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
        <Heading as='h3' size='lg'>Proposals</Heading>
        <TableContainer maxHeight="380px" overflowY="auto">
          <Table>
          <TableCaption>Proposals list</TableCaption>
            <Thead>
              <Tr>
                <Th>Proposal ID</Th>
                <Th>Proposal Description</Th>
              </Tr>
            </Thead>
            <Tbody>{proposalsInformations}</Tbody>
          </Table>
        </TableContainer>
      </Box>
    </section>
  );
}

export default Proposals;
