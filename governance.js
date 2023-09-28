// governance.js
const contractAddress = "0x6227F8e5D2d94De5310d6d46Fb698C4C6ADd143D";
let web3;
let contract;

// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(ABI, contractAddress);
} else {
    alert("Please install MetaMask to interact with this page.");
}

// Function to connect MetaMask
async function connectMetaMask() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length === 0) {
            alert("Please connect to MetaMask.");
        } else {
            checkProposalStatus();
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to check if a proposal is active and fetch related data
async function checkProposalStatus() {
    try {
        const proposalStatus = await contract.methods.proposalActive().call();
        if (proposalStatus) {
            document.getElementById('activeProposal').style.display = 'block';

            // Fetch voting data and update the UI
            const votesInFavor = await contract.methods.votesInFavor().call();
            document.getElementById('votesInFavor').innerText = votesInFavor;

            const votesAgainst = await contract.methods.votesAgainst().call();
            document.getElementById('votesAgainst').innerText = votesAgainst;

            const lockedTokens = await contract.methods.lockedTokens(web3.currentProvider.selectedAddress).call();
            document.getElementById('lockedTokens').innerText = lockedTokens;
        } else {
            document.getElementById('activeProposal').style.display = 'none';
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to vote
async function vote(inFavor) {
    try {
        const voteAmount = document.getElementById('voteAmount').value;
        if (voteAmount <= 0) {
            alert("Invalid voting amount.");
            return;
        }
        const fromAddress = web3.currentProvider.selectedAddress;
        await contract.methods.vote(inFavor, voteAmount).send({ from: fromAddress });

        // Refresh the UI after voting
        checkProposalStatus();
    } catch (error) {
        console.error(error);
    }
}

// Event Listeners
document.getElementById('connectMetamask').addEventListener('click', connectMetaMask);
document.getElementById('voteFavor').addEventListener('click', () => vote(true));
document.getElementById('voteAgainst').addEventListener('click', () => vote(false));

// Once the window is loaded, check if the user has MetaMask connected
window.onload = checkProposalStatus;
