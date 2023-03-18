import { Heading, Box, Alert, AlertIcon } from '@chakra-ui/react';

function ProposalRegistrationClosed() {
    return (
        <section className="proposalRegistration">
            <Box p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
                <Heading as='h3' size='lg'>Proposal registration</Heading>
                <Alert width="auto" my="25px" status='warning' borderRadius='5px'> <AlertIcon />Proposal registration is closed</Alert>
            </Box>
        </section>
    );
}

export default ProposalRegistrationClosed;