import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Heading, Button, FormControl, FormLabel, Input, Text, Box, Alert, AlertIcon, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogContent, AlertDialogOverlay, useDisclosure, Flex, Spacer, Center } from '@chakra-ui/react';

function WhitelistRegistration({ addressToWhitelistLog, setAddressToWhitelistLog }) {

    const [addressToWhitelist, setAddressToWhitelist] = useState("");
    const { state: { contract, accounts, web3 } } = useEth();
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
            <Box my="10px" p="25px" border='1px' borderRadius='25px' borderColor='gray.200'>
                <Heading as='h3' size='lg'>Whitelist registration</Heading>
                <Box m="25px" >
                    <FormControl >
                        <Flex>
                            <Spacer />
                            <Center>
                                <FormLabel>Add address to whitelist :</FormLabel>
                            </Center>
                            <Spacer />
                            <Input width='400px' type='text' placeholder="Add address to whitelist" onChange={handleAdressChange} value={addressToWhitelist} autoComplete="off" />
                            <Spacer />
                            <Button colorScheme='gray' onClick={addAddressToWhitelist}>Add address</Button>
                            <Spacer />
                        </Flex>
                    </FormControl>
                </Box>
                <Box>
                    {(addressToWhitelistLog !== "") ? (<Alert width="auto" status='success' borderRadius='5px'> <AlertIcon /> {addressToWhitelistLog} </Alert>) :
                        <Text></Text>}
                </Box>
            </Box>
            <AlertDialog isOpen={isOpen} onClose={onClose} >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogBody>
                            <Alert width="auto" status='error' borderRadius='5px'> <AlertIcon />Address submitted is invalid.</Alert>
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={onClose}>Close</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </section>
    );
}

export default WhitelistRegistration;