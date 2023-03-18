import { Heading, Box, Alert, AlertIcon } from '@chakra-ui/react';

function VotesNotOpened() {
    return (
        <section className="Votes">
            <Box p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
                <Heading as='h3' size='lg'>Votes</Heading>
                <Alert width="auto" my="25px" status='warning' borderRadius='5px'> <AlertIcon />Votes are not opened</Alert>
            </Box>
        </section>
    );
}

export default VotesNotOpened;