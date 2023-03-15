import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function WhitelistRegistration({addressToWhitelistLog,setAddressToWhitelistLog}) {

    const [addressToWhitelist, setAddressToWhitelist]= useState("");
    const { state: { contract, accounts, web3 } } = useEth();

    //Manage address input
    const handleAdressChange = e => {
        setAddressToWhitelist(e.target.value);
    };

    //Add address to whitelist
    const addAddressToWhitelist = async () => {
        if (!web3.utils.isAddress(addressToWhitelist)) { alert("invalid address"); }

        if (await contract.methods.addVoter(addressToWhitelist).call({ from: accounts[0] })) {
            const addAddressTx = await contract.methods.addVoter(addressToWhitelist).send({ from: accounts[0] });
            const addedAddressToWhitelist = addAddressTx.events.VoterRegistered.returnValues.voterAddress;
            setAddressToWhitelistLog("Address " + addedAddressToWhitelist + " added to the Whitelist");
        }
    };

    return (
        <section className="whitelistRegistration">
            <h3>Whitelist registration</h3>
            <div>
                <label htmlFor="addAddress">Add address to whitelist : </label>
                <input type="text" id="addAddress" name="addAddress" placeholder="Add address to whitelist" onChange={handleAdressChange} value={addressToWhitelist} autoComplete="off" />
                <button onClick={addAddressToWhitelist}>Add address</button>
            </div>
            <div>
                <span>Logs : </span><span>{addressToWhitelistLog}</span>
            </div>
        </section>

    );
}

export default WhitelistRegistration;