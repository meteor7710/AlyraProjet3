import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";

function States({workflowStatusLog, setWorkflowStatusLog, currentWorkflowStatus,setCurrentWorkflowStatus}) {
  const { state: { contract, accounts, creationBlock } } = useEth();
  const [workflowEvents, setWorkflowEvents] = useState();

  //Show current status
  useEffect(() => {
    (async function () {
      const workflowStatus= await contract.methods.workflowStatus().call();
      setCurrentWorkflowStatus(workflowStatus);
    })();
  }, [contract,accounts,setCurrentWorkflowStatus,workflowStatusLog])
 
  //show status event history
  useEffect(() => {
    (async function () {
      const workflowStatusEvents= await contract.getPastEvents('WorkflowStatusChange', {fromBlock: creationBlock,toBlock: 'latest'});
      
      const workflowChanges=[];

      /*workflowStatusEvents.forEach(event => {
        const eventChange = ("Change status from " + event.returnValues.previousStatus + " to " + event.returnValues.newStatus)
        workflowChanges.push( eventChange);
      });

      //Build a list of <li>event</li>
      const listEvents = workflowChanges.map((event,index) => <li key={"status"+index}>{event}</li>);
      setWorkflowEvents(listEvents);*/

      for (let i=0; i < workflowStatusEvents.length ; i++)
      {
        workflowChanges.push(
          {
            blockNumber: workflowStatusEvents[i].blockNumber,
            previousStatus: workflowStatusEvents[i].returnValues.previousStatus,
            newStatus: workflowStatusEvents[i].returnValues.newStatus,
          });
      };

      //Build table body of registered address
      const listWorkflowChanges = workflowChanges.map((status,index) => 
        <tr key={"status"+index}>
          <td>{status.blockNumber}</td>
          <td>{status.previousStatus}</td>
          <td>{status.newStatus}</td>
        </tr>
      );

      setWorkflowEvents(listWorkflowChanges);



 
    })();
  }, [contract,creationBlock,workflowStatusLog])

  //Change workflowstatus to ProposalsRegistrationStarted
  const startProposals = async () => { 
      if (await contract.methods.startProposalsRegistering().call({ from: accounts[0] })){
      const workflowStatusTx =  await contract.methods.startProposalsRegistering().send({ from: accounts[0] })

      const workflowPreviousStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.previousStatus;
      const workflowNewStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.newStatus;

      setWorkflowStatusLog ("Change status from " + workflowPreviousStatus + " to " + workflowNewStatus);
    }
  };

  //Change workflowstatus to ProposalsRegistrationEnded
  const endProposals = async () => { 
    if (await contract.methods.endProposalsRegistering().call({ from: accounts[0] })){
      const workflowStatusTx =  await contract.methods.endProposalsRegistering().send({ from: accounts[0] })

      const workflowPreviousStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.previousStatus;
      const workflowNewStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.newStatus;

      setWorkflowStatusLog ("Change status from " + workflowPreviousStatus + " to " + workflowNewStatus);
    }
  };

  //Change workflowstatus to VotingSessionStarted
  const startVoting = async () => { 
    if (await contract.methods.startVotingSession().call({ from: accounts[0] })){
    const workflowStatusTx =  await contract.methods.startVotingSession().send({ from: accounts[0] })

    const workflowPreviousStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.previousStatus;
    const workflowNewStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.newStatus;

    setWorkflowStatusLog ("Change status from " + workflowPreviousStatus + " to " + workflowNewStatus);
    }
  };

  //Change workflowstatus to VotingSessionEnded
  const endVoting = async () => { 
    if (await contract.methods.endVotingSession().call({ from: accounts[0] })){
        const workflowStatusTx =  await contract.methods.endVotingSession().send({ from: accounts[0] })

        const workflowPreviousStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.previousStatus;
        const workflowNewStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.newStatus;

        setWorkflowStatusLog ("Change status from " + workflowPreviousStatus + " to " + workflowNewStatus);
    }
  };

  //Change workflowstatus to VotesTallied
  const tallyVotes = async () => { 

    if (await contract.methods.tallyVotes().call({ from: accounts[0] })){
      const workflowStatusTx =  await contract.methods.tallyVotes().send({ from: accounts[0] })

      const workflowPreviousStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.previousStatus;
      const workflowNewStatus = workflowStatusTx.events.WorkflowStatusChange.returnValues.newStatus;

      setWorkflowStatusLog ("Change status from " + workflowPreviousStatus + " to " + workflowNewStatus);
    }
  };

  return (
    <section className="states">
      <h3>States</h3>
      <div>
        <span>Current workflow status : </span><span>{currentWorkflowStatus}</span>
      </div>
      <div>
        <p>Change workflow status actions :</p>
        {
          (currentWorkflowStatus === "0") ? <button onClick={startProposals}>Start propossals registration</button> :
          (currentWorkflowStatus === "1") ? <button onClick={endProposals}>End propossals registration</button> :
          (currentWorkflowStatus === "2") ? <button onClick={startVoting}>Start voting session</button> :
          (currentWorkflowStatus === "3") ? <button onClick={endVoting}>End voting session</button> :
          (currentWorkflowStatus === "4") ? <button onClick={tallyVotes}>Tally votes</button> :
          <span>Vote Session Finished</span>
        }   
      </div>
      <div>
        <span>Logs :</span><span>{workflowStatusLog}</span>
      </div>
      <div>
        <span>Workflows status history :</span>
        <div>
          <table>
              <thead>
                <tr>
                  <th>Registration Block Number</th>
                  <th>Previous Status</th>
                  <th>Next Status</th>
                </tr>
              </thead>
            <tbody>{workflowEvents}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default States;
