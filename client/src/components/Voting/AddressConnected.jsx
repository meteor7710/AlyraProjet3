import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react'
function AddressConnected({ currentAddress }) {
  return (
    <Box >
      {
        currentAddress ? <Alert my="5px" width="auto" status='success' borderRadius="25px"> <AlertIcon /> Address connected {currentAddress} </Alert> :
          <Text></Text>
      }
    </Box>
  );
}

export default AddressConnected;
