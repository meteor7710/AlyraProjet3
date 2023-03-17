import { Heading, Box, Text } from '@chakra-ui/react';

function VotesNotOpened() {
    return (
        <section className="Votes">
            <Box p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
                <Heading as='h3' size='lg'>Votes</Heading>
                <Text>Votes are not opened</Text>
            </Box>
        </section>

    );
  }
  
  export default VotesNotOpened;