import { Heading, Box, Text } from '@chakra-ui/react';

function WhitelistRegistrationClosed() {
    return (
        <section className="whitelistRegistration">
            <Box p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
                <Heading as='h3' size='lg'>Whitelist registration</Heading>
                <Text>Whitelist registration is closed</Text>
            </Box>
        </section>

    );
  }
  
  export default WhitelistRegistrationClosed;