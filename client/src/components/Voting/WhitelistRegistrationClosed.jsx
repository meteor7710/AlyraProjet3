import { Heading, Box, Alert, AlertIcon } from '@chakra-ui/react';

function WhitelistRegistrationClosed() {
    return (
        <section className="whitelistRegistration">
            <Box my="10px" p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
                <Heading as='h3' size='lg'>Whitelist registration</Heading>
                <Alert width="auto" my="25px" status='warning' borderRadius='25px'> <AlertIcon />Whitelist registration is closed</Alert>
            </Box>
        </section>
    );
}

export default WhitelistRegistrationClosed;