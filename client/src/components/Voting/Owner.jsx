import Whitelist from "./Whitelist";
import WhitelistRegistration from "./WhitelistRegistration";
import WhitelistRegistrationClosed from "./WhitelistRegistrationClosed";
import States from "./States";
import useEth from "../../contexts/EthContext/useEth";

function Owner({addressToWhitelistLog,setAddressToWhitelistLog,workflowStatusLog, setWorkflowStatusLog,currentWorkflowStatus,setCurrentWorkflowStatus}) {
    const { state: { accounts, owner } } = useEth();

    const ownerTools =
        <>
            {
                (currentWorkflowStatus === "0")  ? <WhitelistRegistration  addressToWhitelistLog={addressToWhitelistLog} setAddressToWhitelistLog={setAddressToWhitelistLog}/> :
                <WhitelistRegistrationClosed />
            }
            <Whitelist addressToWhitelistLog={addressToWhitelistLog}/>
            <hr />
            <States workflowStatusLog={workflowStatusLog} setWorkflowStatusLog={setWorkflowStatusLog} currentWorkflowStatus={currentWorkflowStatus} setCurrentWorkflowStatus={setCurrentWorkflowStatus}/>
            <hr />
        </>;

    return (
        <div className="Owner">
            {
                (owner === accounts[0]) ? ownerTools :
                    <span></span>
            }
        </div>
    );
}

export default Owner;