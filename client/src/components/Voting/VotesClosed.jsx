import { Heading, Box, Text } from '@chakra-ui/react';

function VotesClosed() {
    return (
        <section className="Votes">
            <Box  p="25px" border='1px' borderRadius='5px' borderColor='gray.200'>
                <Heading as='h3' size='lg'>Votes</Heading>
                <Text>Votes are closed</Text>
            </Box>
        </section>
    );
  }
  
  export default VotesClosed;