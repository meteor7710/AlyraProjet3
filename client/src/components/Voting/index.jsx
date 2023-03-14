import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Owner from "./Owner";
import Voter from "./Voter";
import Result from "./Result";
import { useState } from "react";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Voting() {
  const { state } = useEth();
  const [addressToWhitelistLog, setAddressToWhitelistLog]= useState();

  const voting =
    <>
      <div className="contract-container">
        <Owner addressToWhitelistLog={addressToWhitelistLog} setAddressToWhitelistLog={setAddressToWhitelistLog}/>
        <Voter addressToWhitelistLog={addressToWhitelistLog}/>        
        <Result />
      </div>
    </>;

  return (
    <div className="voting">
      <Title />
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
          voting
      }
    </div>
  );
}

export default Voting;
