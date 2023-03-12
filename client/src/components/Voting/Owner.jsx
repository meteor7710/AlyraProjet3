import Whitelist from "./Whitelist";
import States from "./States";
import useEth from "../../contexts/EthContext/useEth";

function Owner() {
    const { state: { accounts, owner } } = useEth();

    const ownerTools =
        <>
            <Whitelist />
            <hr />
            <States />
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