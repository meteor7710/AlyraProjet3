const Voting = artifacts.require("./Voting.sol");
const { BN, constants, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract("Voting simple tests", accounts => {

    const _owner = accounts[0];
    const _voter1 = accounts[1];
    const _voter2 = accounts[2];
    const _voter3 = accounts[3];
    const _nonVoter = accounts[9];

    let votingInstance;

    beforeEach(async () => {
        votingInstance = await Voting.new({ from: _owner });
    });


    //Initial state variables tests
    describe("Intial state variables tests", () => {

        it("has started winningProposalID to 0", async () => {
            expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal("0");
        });

        it("has started workflowStatus to RegisteringVoters(0)", async () => {
            expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("0");
        });
    })

    //Getters tests
    describe("Getters function tests", () => {
        it("only voters can request voter informations", async () => {
            await votingInstance.addVoter(_voter1, { from: _owner });
            let voter1;
            await expectRevert(voter1 = votingInstance.getVoter.call(_voter1, { from: _nonVoter }), "You're not a voter");
            expect(await (voter1 = votingInstance.getVoter.call(_voter1, { from: _voter1 })));
        });
        it("only voters can request proposal informations", async () => {
            await votingInstance.addVoter(_voter1, { from: _owner });
            await votingInstance.startProposalsRegistering({ from: _owner })
            let proposal;
            await expectRevert(proposal = votingInstance.getOneProposal.call(0, { from: _nonVoter }), "You're not a voter");
            expect(await (proposal = votingInstance.getOneProposal.call(0, { from: _voter1 })));
        });
    })

    //Workflow status change
    describe("States function tests", () => {

        // RegisteringVoters status tests
        describe("Change from RegisteringVoters to other tests", () => {
            it("owner can change status from RegisteringVoters to ProposalsRegistrationStarted", async () => {
                expect(await votingInstance.startProposalsRegistering({ from: _owner }));
            });

            it("non-owner can't change status from RegisteringVoters to ProposalsRegistrationStarted", async () => {
                await expectRevert(votingInstance.startProposalsRegistering({ from: _voter1 }), 'Ownable: caller is not the owner');
            });

            it("change status from RegisteringVoters to ProposalsRegistrationStarted change workflowStatus to 1", async () => {
                await votingInstance.startProposalsRegistering({ from: _owner });
                expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("1");
            });

            it("change status from RegisteringVoters to VotingSessionStarted is not possible", async () => {
                await expectRevert(votingInstance.startVotingSession({ from: _owner }), 'Registering proposals phase is not finished');
            });

            it("event is correctly emmited when changed status to ProposalsRegistrationStarted", async () => {
                const changeStatus = await votingInstance.startProposalsRegistering({ from: _owner });
                await expectEvent(changeStatus, "WorkflowStatusChange", { previousStatus: BN(0), newStatus: BN(1) });
            });
        });

        // ProposalsRegistrationStarted status tests
        describe("Change from ProposalsRegistrationStarted to other tests", () => {

            beforeEach(async () => {
                await votingInstance.addVoter(_voter1, { from: _owner })
                await votingInstance.startProposalsRegistering({ from: _owner });
            });

            it("default GENESIS proposal with ID 0 is created", async () => {
                let proposal;
                proposal = await votingInstance.getOneProposal(0, { from: _voter1 });
                expect(proposal.description).to.equal("GENESIS");
            });

            it("owner can change status from ProposalsRegistrationStarted to ProposalsRegistrationEnded", async () => {
                expect(await votingInstance.endProposalsRegistering({ from: _owner }));
            });

            it("non-owner can't change status from ProposalsRegistrationStarted to ProposalsRegistrationEnded", async () => {
                await expectRevert(votingInstance.endProposalsRegistering({ from: _voter1 }), 'Ownable: caller is not the owner');
            });

            it("change status from ProposalsRegistrationStarted to ProposalsRegistrationEnded change workflowStatus to 2", async () => {
                await votingInstance.endProposalsRegistering({ from: _owner });
                expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("2");
            });

            it("change status from ProposalsRegistrationStarted to VotingSessionStarted is not possible", async () => {
                await expectRevert(votingInstance.startVotingSession({ from: _owner }), 'Registering proposals phase is not finished');
            });

            it("event is correctly emmited when changed status to ProposalsRegistrationStarted", async () => {
                const changeStatus = await votingInstance.endProposalsRegistering({ from: _owner });
                await expectEvent(changeStatus, "WorkflowStatusChange", { previousStatus: BN(1), newStatus: BN(2) });
            });
        });

        // ProposalsRegistrationEnded status tests
        describe("Change from ProposalsRegistrationEnded to other tests", () => {

            beforeEach(async () => {
                await votingInstance.startProposalsRegistering({ from: _owner });
                await votingInstance.endProposalsRegistering({ from: _owner });

            });

            it("owner can change status from ProposalsRegistrationEnded to startVotingSession", async () => {
                expect(await votingInstance.startVotingSession({ from: _owner }));
            });

            it("non-owner can't change status from ProposalsRegistrationEnded to startVotingSession", async () => {
                await expectRevert(votingInstance.startVotingSession({ from: _voter1 }), 'Ownable: caller is not the owner');
            });

            it("change status from ProposalsRegistrationEnded to startVotingSession change workflowStatus to 3", async () => {
                await votingInstance.startVotingSession({ from: _owner });
                expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("3");
            });

            it("change status from ProposalsRegistrationEnded to VotingSessionEnded is not possible", async () => {
                await expectRevert(votingInstance.endVotingSession({ from: _owner }), 'Voting session havent started yet');
            });

            it("event is correctly emmited when changed status to startVotingSession", async () => {
                const changeStatus = await votingInstance.startVotingSession({ from: _owner });
                await expectEvent(changeStatus, "WorkflowStatusChange", { previousStatus: BN(2), newStatus: BN(3) });
            });
        });

        // VotingSessionStarted status tests
        describe("Change from VotingSessionStarted to other tests", () => {

            beforeEach(async () => {
                await votingInstance.startProposalsRegistering({ from: _owner });
                await votingInstance.endProposalsRegistering({ from: _owner });
                await votingInstance.startVotingSession({ from: _owner });
            });

            it("owner can change status from startVotingSession to VotingSessionEnded", async () => {
                expect(await votingInstance.endVotingSession({ from: _owner }));
            });

            it("non-owner can't change status from startVotingSession to VotingSessionEnded", async () => {
                await expectRevert(votingInstance.endVotingSession({ from: _voter1 }), 'Ownable: caller is not the owner');
            });

            it("change status from startVotingSession to VotingSessionEnded change workflowStatus to 4", async () => {
                await votingInstance.endVotingSession({ from: _owner });
                expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("4");
            });

            it("change status from startVotingSession to ProposalsRegistrationEnded is not possible", async () => {
                await expectRevert(votingInstance.endProposalsRegistering({ from: _owner }), 'Registering proposals havent started yet');
            });

            it("event is correctly emmited when changed status to VotingSessionEnded", async () => {
                const changeStatus = await votingInstance.endVotingSession({ from: _owner });
                await expectEvent(changeStatus, "WorkflowStatusChange", { previousStatus: BN(3), newStatus: BN(4) });
            });
        });

        // VotingSessionEnded status tests
        describe("Change from VotingSessionEnded to other tests", () => {

            beforeEach(async () => {
                await votingInstance.addVoter(_voter1, { from: _owner });
                await votingInstance.startProposalsRegistering({ from: _owner });
                await votingInstance.addProposal("proposal1", { from: _voter1 })
                await votingInstance.endProposalsRegistering({ from: _owner });
                await votingInstance.startVotingSession({ from: _owner });
                await votingInstance.setVote(1, { from: _voter1 });
                await votingInstance.endVotingSession({ from: _owner });
            });

            it("owner can change status from VotingSessionEnded to VotesTallied", async () => {
                expect(await votingInstance.tallyVotes({ from: _owner }));
            });

            it("non-owner can't change status from VotingSessionEnded to VotesTallied", async () => {
                await expectRevert(votingInstance.tallyVotes({ from: _voter1 }), 'Ownable: caller is not the owner');
            });

            it("change status from VotingSessionEnded to VotesTallied change workflowStatus to 5", async () => {
                await votingInstance.tallyVotes({ from: _owner });
                expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("5");
            });

            it("change status from VotingSessionEnded to ProposalsRegistrationEnded is not possible", async () => {
                await expectRevert(votingInstance.endProposalsRegistering({ from: _owner }), 'Registering proposals havent started yet');
            });

            it("event is correctly emmited when changed status to VotesTallied", async () => {
                const changeStatus = await votingInstance.tallyVotes({ from: _owner });
                await expectEvent(changeStatus, "WorkflowStatusChange", { previousStatus: BN(4), newStatus: BN(5) });
            });

            it("votes are correctly tallied with 1 vote 1 proposal", async () => {
                await votingInstance.tallyVotes({ from: _owner })
                expect(await votingInstance.winningProposalID()).to.be.bignumber.equal("1");
            });
        });

        // VotesTallied status tests
        describe("Change from VotesTallied to other tests", () => {
            it("change status from VotesTallied to ProposalsRegistrationStarted is not possible", async () => {
                await votingInstance.startProposalsRegistering({ from: _owner });
                await votingInstance.endProposalsRegistering({ from: _owner });
                await votingInstance.startVotingSession({ from: _owner });
                await votingInstance.endVotingSession({ from: _owner });
                await votingInstance.tallyVotes({ from: _owner });
                await expectRevert(votingInstance.startProposalsRegistering({ from: _owner }), 'Registering proposals cant be started now');
            });
        });
    });


    //Add voter tests
    describe("Registration function tests", () => {
        it("owner can add voter", async () => {
            expect(await votingInstance.addVoter(_voter1, { from: _owner }));
        });

        it("non-owner can't add voter", async () => {
            await expectRevert(votingInstance.addVoter(_voter2, { from: _voter1 }), 'Ownable: caller is not the owner');
        });

        it("can not add voter when state is not RegisteringVoters", async () => {
            await votingInstance.startProposalsRegistering({ from: _owner });
            await expectRevert(votingInstance.addVoter(_voter1, { from: _owner }), 'Voters registration is not open yet');
        });

        it("voter isRegistered is set true when a voter is added", async () => {
            await votingInstance.addVoter(_voter1, { from: _owner });
            const voter1 = await votingInstance.getVoter.call(_voter1, { from: _voter1 });
            expect(voter1.isRegistered).to.be.true;
        });

        it("voter can be added only one time", async () => {
            await votingInstance.addVoter(_voter1, { from: _owner });
            await expectRevert(votingInstance.addVoter(_voter1, { from: _owner }), 'Already registered');
        });

        it("event is correctly emmited when added voter", async () => {
            const vote = await votingInstance.addVoter(_voter1, { from: _owner });
            await expectEvent(vote, "VoterRegistered", { voterAddress: _voter1 });
        });
    });

    //Add Proposal tests
    describe("Proposal function tests", () => {
        beforeEach(async () => {
            await votingInstance.addVoter(_voter1, { from: _owner });
            await votingInstance.addVoter(_voter2, { from: _owner });
            await votingInstance.startProposalsRegistering({ from: _owner });
        });

        it("voter can add proposal", async () => {
            expect(await votingInstance.addProposal("Proposal", { from: _voter1 }));
            expect(await votingInstance.addProposal("Proposal", { from: _voter2 }));

        });

        it("voter can add several proposal", async () => {
            expect(await votingInstance.addProposal("Proposal1", { from: _voter1 }));
            expect(await votingInstance.addProposal("Proposal2", { from: _voter1 }));
        });

        it("non-voter can't add proposal", async () => {
            await expectRevert(votingInstance.addProposal("Proposal", { from: _nonVoter }), "You're not a voter");
        });

        it("can not add a proposal when state is not ProposalsRegistrationStarted", async () => {
            await votingInstance.endProposalsRegistering({ from: _owner });
            await expectRevert(votingInstance.addProposal("Proposal", { from: _voter1 }), 'Proposals are not allowed yet');
        });

        it("proposal can not be empty", async () => {
            await expectRevert(votingInstance.addProposal("", { from: _voter1 }), "Vous ne pouvez pas ne rien proposer");
        });

        it("proposals descriptions are correctly stored", async () => {
            await votingInstance.addProposal("ProposalDesc1", { from: _voter1 });
            await votingInstance.addProposal("ProposalDesc2", { from: _voter2 });
            const proposal0 = await votingInstance.getOneProposal.call(0, { from: _voter1 });
            const proposal1 = await votingInstance.getOneProposal.call(1, { from: _voter1 });
            const proposal2 = await votingInstance.getOneProposal.call(2, { from: _voter1 });
            expect(proposal0.description).to.equal("GENESIS");
            expect(proposal1.description).to.equal("ProposalDesc1");
            expect(proposal2.description).to.equal("ProposalDesc2");
        });

        it("event is correctly emmited when proposal is submitted", async () => {
            const submitProp1 = await votingInstance.addProposal("ProposalDesc1", { from: _voter1 });
            await expectEvent(submitProp1, "ProposalRegistered", { proposalId: BN(1) });
            const submitProp2 = await votingInstance.addProposal("ProposalDesc2", { from: _voter1 });
            await expectEvent(submitProp2, "ProposalRegistered", { proposalId: BN(2) });
        });
    });

    //Add Vote tests
    describe("Vote function tests", () => {
        beforeEach(async () => {
            await votingInstance.addVoter(_voter1, { from: _owner });
            await votingInstance.addVoter(_voter2, { from: _owner });
            await votingInstance.addVoter(_voter3, { from: _owner });
            await votingInstance.startProposalsRegistering({ from: _owner });
            await votingInstance.addProposal("ProposalDesc1", { from: _voter1 });
            await votingInstance.addProposal("ProposalDesc2", { from: _voter2 });
            await votingInstance.addProposal("ProposalDesc3", { from: _voter1 });
            await votingInstance.endProposalsRegistering({ from: _owner });
            await votingInstance.startVotingSession({ from: _owner });
        });


        it("voter can vote", async () => {
            expect(await votingInstance.setVote(2, { from: _voter1 }));
            expect(await votingInstance.setVote(1, { from: _voter2 }));
            expect(await votingInstance.setVote(3, { from: _voter3 }));

        });

        it("non-voter can't vote", async () => {
            await expectRevert(votingInstance.setVote(2, { from: _nonVoter }), "You're not a voter");
        });

        it("can not vote when state is not VotingSessionStarted", async () => {
            await votingInstance.endVotingSession({ from: _owner });
            await expectRevert(votingInstance.setVote(1, { from: _voter1 }), 'Voting session havent started yet');
        });

        it("voter can vote only 1 time", async () => {
            expect(await votingInstance.setVote(2, { from: _voter1 }));
            await expectRevert(votingInstance.setVote(1, { from: _voter1 }), 'You have already voted');
        });

        it("voter can only vote for existing proposal", async () => {
            await expectRevert(votingInstance.setVote(10, { from: _voter1 }), 'Proposal not found');
        });

        it("voter votedProposalId is set to proposal ID when he has voted", async () => {
            await votingInstance.setVote(2, { from: _voter1 });
            const voter1 = await votingInstance.getVoter.call(_voter1, { from: _voter1 });
            expect(voter1.votedProposalId).to.be.bignumber.equal("2");
        });

        it("voter hasVoted is set true when he has voted", async () => {
            await votingInstance.setVote(2, { from: _voter1 });
            const voter1 = await votingInstance.getVoter.call(_voter1, { from: _voter1 });
            expect(voter1.hasVoted).to.be.true;
        });

        it("proposal voteCount is incremented  when a voter has voted it", async () => {
            let proposal;
            proposal = await votingInstance.getOneProposal.call(2, { from: _voter1 });
            expect(proposal.voteCount).to.be.bignumber.equal("0");
            await votingInstance.setVote(2, { from: _voter1 });
            proposal = await votingInstance.getOneProposal.call(2, { from: _voter1 });
            expect(proposal.voteCount).to.be.bignumber.equal("1");
            await votingInstance.setVote(2, { from: _voter2 });
            proposal = await votingInstance.getOneProposal.call(2, { from: _voter1 });
            expect(proposal.voteCount).to.be.bignumber.equal("2");

        });

        it("event is correctly emmited when proposal is submitted", async () => {
            const submitVote1 = await votingInstance.setVote(2, { from: _voter1 });
            await expectEvent(submitVote1, "Voted", { voter: _voter1, proposalId: BN(2) });
            const submitVote2 = await votingInstance.setVote(1, { from: _voter2 });
            await expectEvent(submitVote2, "Voted", { voter: _voter2, proposalId: BN(1) });
        });
    });
});

contract("Voting scenarios tests", accounts => {

    const _owner = accounts[0];
    const _voter1 = accounts[1];
    const _voter2 = accounts[2];
    const _voter3 = accounts[3];
    const _voter4 = accounts[4];
    const _voter5 = accounts[5];
    const _voter6 = accounts[6];

    let votingInstance;

    beforeEach(async () => {
        votingInstance = await Voting.new({ from: _owner });
    });

    it("Scenario 1 - 4 voters  - 3 proposals - 1 winner", async () => {
        //Add voters
        await votingInstance.addVoter(_voter1, { from: _owner });
        await votingInstance.addVoter(_voter2, { from: _owner });
        await votingInstance.addVoter(_voter3, { from: _owner });
        await votingInstance.addVoter(_voter4, { from: _owner });

        //Add proposals
        await votingInstance.startProposalsRegistering({ from: _owner });
        await votingInstance.addProposal("ProposalDesc1", { from: _voter1 });
        await votingInstance.addProposal("ProposalDesc2", { from: _voter2 });
        await votingInstance.addProposal("ProposalDesc3", { from: _voter1 });
        await votingInstance.endProposalsRegistering({ from: _owner });

        //Submit votes
        await votingInstance.startVotingSession({ from: _owner });
        await votingInstance.setVote(2, { from: _voter1 });
        await votingInstance.setVote(2, { from: _voter2 });
        await votingInstance.setVote(2, { from: _voter3 });
        await votingInstance.setVote(3, { from: _voter4 });
        await votingInstance.endVotingSession({ from: _owner });

        //Tally votes
        await votingInstance.tallyVotes({ from: _owner });

        //Result analyses
        let proposal;
        proposal = await votingInstance.getOneProposal.call(1, { from: _voter1 });
        expect(proposal.voteCount).to.be.bignumber.equal("0");
        proposal = await votingInstance.getOneProposal.call(2, { from: _voter1 });
        expect(proposal.voteCount).to.be.bignumber.equal("3");
        proposal = await votingInstance.getOneProposal.call(3, { from: _voter1 });
        expect(proposal.voteCount).to.be.bignumber.equal("1");

        let voter;
        voter = await votingInstance.getVoter.call(_voter1, { from: _voter1 });
        expect(voter.hasVoted).to.be.true;
        expect(voter.votedProposalId).to.be.bignumber.equal("2");
        voter = await votingInstance.getVoter.call(_voter2, { from: _voter1 });
        expect(voter.hasVoted).to.be.true;
        expect(voter.votedProposalId).to.be.bignumber.equal("2");
        voter = await votingInstance.getVoter.call(_voter3, { from: _voter1 });
        expect(voter.hasVoted).to.be.true;
        expect(voter.votedProposalId).to.be.bignumber.equal("2");
        voter = await votingInstance.getVoter.call(_voter4, { from: _voter1 });
        expect(voter.hasVoted).to.be.true;
        expect(voter.votedProposalId).to.be.bignumber.equal("3");

        expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal("2");
    });

    it("Scenario 2 - 6 voters (5 votes)  - 7 proposals - 2 winners (only 1st winner is kept)", async () => {
        //Add voters
        await votingInstance.addVoter(_voter1, { from: _owner });
        await votingInstance.addVoter(_voter2, { from: _owner });
        await votingInstance.addVoter(_voter3, { from: _owner });
        await votingInstance.addVoter(_voter4, { from: _owner });
        await votingInstance.addVoter(_voter5, { from: _owner });
        await votingInstance.addVoter(_voter6, { from: _owner });

        //Add proposals
        await votingInstance.startProposalsRegistering({ from: _owner });
        await votingInstance.addProposal("ProposalDesc1", { from: _voter1 });
        await votingInstance.addProposal("ProposalDesc2", { from: _voter2 });
        await votingInstance.addProposal("ProposalDesc3", { from: _voter1 });
        await votingInstance.addProposal("ProposalDesc4", { from: _voter1 });
        await votingInstance.addProposal("ProposalDesc5", { from: _voter5 });
        await votingInstance.addProposal("ProposalDesc6", { from: _voter1 });
        await votingInstance.addProposal("ProposalDesc7", { from: _voter6 });
        await votingInstance.endProposalsRegistering({ from: _owner });

        //Submit votes
        await votingInstance.startVotingSession({ from: _owner });
        await votingInstance.setVote(1, { from: _voter1 });
        await votingInstance.setVote(1, { from: _voter2 });
        await votingInstance.setVote(2, { from: _voter3 });
        await votingInstance.setVote(6, { from: _voter4 });
        await votingInstance.setVote(6, { from: _voter6 });
        await votingInstance.endVotingSession({ from: _owner });

        //Tally votes
        await votingInstance.tallyVotes({ from: _owner });


        //Result analyses
        let proposal;
        proposal = await votingInstance.getOneProposal.call(1, { from: _voter1 });
        expect(proposal.voteCount).to.be.bignumber.equal("2");
        proposal = await votingInstance.getOneProposal.call(2, { from: _voter1 });
        expect(proposal.voteCount).to.be.bignumber.equal("1");
        proposal = await votingInstance.getOneProposal.call(3, { from: _voter1 });
        expect(proposal.voteCount).to.be.bignumber.equal("0");
        proposal = await votingInstance.getOneProposal.call(4, { from: _voter1 });
        expect(proposal.voteCount).to.be.bignumber.equal("0");
        proposal = await votingInstance.getOneProposal.call(5, { from: _voter1 });
        expect(proposal.voteCount).to.be.bignumber.equal("0");
        proposal = await votingInstance.getOneProposal.call(6, { from: _voter1 });
        expect(proposal.voteCount).to.be.bignumber.equal("2");
        proposal = await votingInstance.getOneProposal.call(7, { from: _voter1 });
        expect(proposal.voteCount).to.be.bignumber.equal("0");

        let voter;
        voter = await votingInstance.getVoter.call(_voter1, { from: _voter1 });
        expect(voter.hasVoted).to.be.true;
        expect(voter.votedProposalId).to.be.bignumber.equal("1");
        voter = await votingInstance.getVoter.call(_voter2, { from: _voter1 });
        expect(voter.hasVoted).to.be.true;
        expect(voter.votedProposalId).to.be.bignumber.equal("1");
        voter = await votingInstance.getVoter.call(_voter3, { from: _voter1 });
        expect(voter.hasVoted).to.be.true;
        expect(voter.votedProposalId).to.be.bignumber.equal("2");
        voter = await votingInstance.getVoter.call(_voter4, { from: _voter1 });
        expect(voter.hasVoted).to.be.true;
        expect(voter.votedProposalId).to.be.bignumber.equal("6");
        voter = await votingInstance.getVoter.call(_voter5, { from: _voter1 });
        expect(voter.hasVoted).to.be.false;
        expect(voter.votedProposalId).to.be.bignumber.equal("0");
        voter = await votingInstance.getVoter.call(_voter6, { from: _voter1 });
        expect(voter.hasVoted).to.be.true;
        expect(voter.votedProposalId).to.be.bignumber.equal("6");

        //Only first results with the higher votes is kept
        expect(await votingInstance.winningProposalID.call()).to.be.bignumber.equal("1");
    });
});