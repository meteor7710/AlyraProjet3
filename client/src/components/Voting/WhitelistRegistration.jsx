import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Heading } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
  } from '@chakra-ui/react'

  import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
  } from '@chakra-ui/react'

  import { useDisclosure } from '@chakra-ui/react'

  import { Flex, Spacer } from '@chakra-ui/react'
  import { Center, Square, Circle } from '@chakra-ui/react'

function WhitelistRegistration({addressToWhitelistLog,setAddressToWhitelistLog}) {

    const [addressToWhitelist, setAddressToWhitelist]= useState("");
    const { state: { contract, accounts, web3 } } = useEth();

    const isError = addressToWhitelist === "" ;

    const { isOpen, onOpen, onClose } = useDisclosure()


    //Manage address input
    const handleAdressChange = e => {
        setAddressToWhitelist(e.target.value);
    };

    //Add address to whitelist
    const addAddressToWhitelist = async () => {
        if (!web3.utils.isAddress(addressToWhitelist)) { onOpen(); return; }

        

        if (await contract.methods.addVoter(addressToWhitelist).call({ from: accounts[0] })) {
            const addAddressTx = await contract.methods.addVoter(addressToWhitelist).send({ from: accounts[0] });
            const addedAddressToWhitelist = addAddressTx.events.VoterRegistered.returnValues.voterAddress;
            setAddressToWhitelistLog("Address " + addedAddressToWhitelist + " added to the Whitelist");
        }
    };

    return (
        <section className="whitelistRegistration">
            <Box p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
            <Heading as='h3' size='lg'>Whitelist registration</Heading>
            <Box m="25px" >
                <FormControl >
                <Flex>
                    <Spacer />
                    <Center>
                        <FormLabel>Add address to whitelist :</FormLabel>
                    </Center>
                    <Spacer />
                    <Input width='400px' type='text' placeholder="Add address to whitelist" onChange={handleAdressChange} value={addressToWhitelist} autoComplete="off"/>
                    <Spacer />
                    <Button colorScheme='gray' onClick={addAddressToWhitelist}>Add address</Button>
                    <Spacer />
                </Flex>
                </FormControl>
            </Box>
            <Box>
                {( addressToWhitelistLog !== "" ) ? (<Alert status='success'> <AlertIcon /> {addressToWhitelistLog} </Alert>) :
                 <Text></Text>}
            </Box>
            </Box>



    <AlertDialog isOpen={isOpen} onClose={onClose} >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogBody>
                Adress submitted is invalid.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button  onClick={onClose}>Close</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>


        </section>

    );
}

export default WhitelistRegistration;