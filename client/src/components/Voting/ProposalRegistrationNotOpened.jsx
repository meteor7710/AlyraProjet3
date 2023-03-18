import { Heading, Box, Alert, AlertIcon } from '@chakra-ui/react';

function ProposalRegistrationNotOpened() {
    return (
        <section className="proposalRegistration">
            <Box my="10px" p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
                <Heading as='h3' size='lg'>Proposal registration</Heading>
                <Alert width="auto" my="25px" status='warning' borderRadius='5px'> <AlertIcon />Proposal registration is not opened</Alert>
            </Box>
        </section>
    );
}

export default ProposalRegistrationNotOpened;