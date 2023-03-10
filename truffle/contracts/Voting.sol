// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

///  @title A voting system contract
///  @author Kevin and Loic
///  @notice You can use this contract to manage a vote session
///  @dev contract extends OpenZeppelin's Ownable contract
contract Voting is Ownable { 
    uint public winningProposalID;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;


    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    

    // ::::::::::::: GETTERS ::::::::::::: //

    /// @notice Use this feature to retrieve voter data
    /// @dev Retrieve voter mapping data
    /// @param  _addr voter address
    /// @return Voter struct

    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }

    /// @notice Use this feature to retrieve proposal data
    /// @dev Retrieve proposal array data
    /// @param  _id proposal ID 
    /// @return Proposal struct

    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }


    // ::::::::::::: REGISTRATION ::::::::::::: // 

    /// @notice Register an address to the voter's whitelist
    /// @dev Only contract's owner can use the function. Workflow status needs to be RegisteringVoters. An address can be registered only one time
    /// @param  _addr voter address to add to the whitelist

    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }


    // ::::::::::::: PROPOSAL ::::::::::::: //

    /// @notice Register a proposal for the vote session
    /// @dev Only voters can use the function. Workflow status needs to be ProposalsRegistrationStarted. A proposal can not be empty
    /// @param  _desc proposal's description
    
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /// @notice Register a vot for a proposal
    /// @dev Only voters can use the function. Workflow status needs to be VotingSessionStarted. A voter can vote only one time
    /// @dev Calculate the current winningProposalID. Note that in case of equality we keep the first vote.
    /// @param  _id vote proposal's ID

    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found'); // pas oblig??, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);

        //Calculate the winningProposalID to protect the contract from an attack
        if (_id != winningProposalID) {
            if (proposalsArray[_id].voteCount > proposalsArray[winningProposalID].voteCount){
                winningProposalID=_id;
            }
        }
    }


    // ::::::::::::: STATE ::::::::::::: //

    /// @notice Change workflow status to ProposalsRegistrationStarted
    /// @dev Only contract's owner can use the function. Workflow status needs to be RegisteringVoters. A default proposal with ID 0 is created with description 'GENESIS'

    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;

        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);

        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @notice Change workflow status to ProposalsRegistrationEnded
    /// @dev Only contract's owner can use the function. Workflow status needs to be ProposalsRegistrationStarted
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @notice Change workflow status to VotingSessionStarted
    /// @dev Only contract's owner can use the function. Workflow status needs to be ProposalsRegistrationEnded

    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /// @notice Change workflow status to VotingSessionEnded
    /// @dev Only contract's owner can use the function. Workflow status needs to be VotingSessionStarted

    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    function tallyVotes() external onlyOwner {
      require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
      workflowStatus = WorkflowStatus.VotesTallied;
      emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}