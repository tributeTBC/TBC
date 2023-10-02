import { contractAddress, ABI } from "./abi.js";

document.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connect-button");
  const status = document.getElementById("status");
  const contractData = document.getElementById("contract-data");
  const sect1 = document.getElementById("info-section");
  const sect2 = document.getElementById("vote-section");
  const floatT = document.getElementById("floatT");
  const oyla = document.getElementById("tx-button1");
  const tRelease = document.getElementById("tx-button2");
  const voteAmountInput = document.getElementById("vote-amount");
  const voteButton = document.getElementById("tx-button1");
  const vText = document.getElementById("vote");

  let web3 = new Web3(window.ethereum);
  let isProposalActive = false;
  let haveFloatingTokens = 0;
  const contract = new web3.eth.Contract(ABI, contractAddress);

  const predefinedNetworkId = "0x15eb";

  async function fetchContractData() {
    try {
      const currentTotalSupply = (
        await contract.methods.currentTotalSupply().call()
      ).toString();
      const developer = await contract.methods.developer().call();

      // Fetch contract information here
      const isProposalActive = await contract.methods.proposalActive().call();

      // Create explanations based on contract data
      let infoText = ``;
      let vTextr = ``;
      if (isProposalActive) {
        infoText +=
          "<span style='color: red;'>There is an active proposal</span><br>";
      } else {
        infoText +=
          "<span style='color: grey;'>No active proposal currently</span><br>";
        // Display the information in the contractData element and return early
        contractData.innerHTML = infoText;
        return;
      }

      const proposalId = (
        await contract.methods.proposalId().call()
      ).toLocaleString();
      const proposalAmount = (
        Number(await contract.methods.proposalAmount().call()) / 1e18
      ) // Convert Wei to Ether
        .toLocaleString(); // Add thousands separator
      const proposalDescription = await contract.methods
        .proposalDescription()
        .call();
      const votesInFavor = (
        Number(await contract.methods.votesInFavor().call()) / 1e18
      ) // Convert Wei to Ether
        .toLocaleString(); // Add thousands separator
      const requiredVotes = (
        Number(await contract.methods.tokensRequiredToFinalize().call()) / 1e18
      ) // Convert Wei to Ether
        .toLocaleString(); // Add thousands separator
      const proposalExpiry = (
        await contract.methods.proposalExpiry().call()
      ).toString();

      infoText += `Proposal ID: <span style='color: red;'>${proposalId}</span><br>`;
      infoText += `Proposal Amount: <span style='color: red;'>${proposalAmount} tokens</span><br>`;
      infoText += `Proposal Description: <span style='color: red;'>${proposalDescription}</span><br>`;
      infoText += `Votes In Favor: <span style='color: red;'>${votesInFavor} tokens</span><br>`;
      infoText += `Required Votes: <span style='color: red;'>${requiredVotes} tokens</span><br>`;

      // Convert proposalExpiry to a human-readable date format (EU format)
      const proposalExpiryDate =
        new Date(proposalExpiry * 1000).toLocaleDateString("en-GB") +
        " " +
        new Date(proposalExpiry * 1000).toLocaleTimeString();

      infoText += `Proposal Expiry Date: <span style='color: red;'>${proposalExpiryDate}</span><br>`;

      vTextr = `Vote for Proposal:<span style='color: red;'>${proposalId}</span>`;
      // Display the information in the contractData element
      contractData.innerHTML = infoText;
      vText.innerHTML = vTextr;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `An error occurred while fetching data: ${error}`,
      });
    }
  }

  async function updateUI() {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      // Check if there are active proposals before updating the UI
      isProposalActive = await contract.methods.proposalActive().call();
      haveFloatingTokens =
        Number(await contract.methods.getUnlockedTokens(accounts[0]).call()) /
        1e18;

      if (accounts.length > 0 && chainId === predefinedNetworkId) {
        status.innerText = `Status: Connected to ${accounts[0]} on chain ${chainId}`;
        //txButton1.style.display = "hidden";
        //txButton2.style.display = "inline-block";
        if (haveFloatingTokens > 0) {
          let floatText = ``;
          sect2.style.display = "inline-block";
          floatT.style.color = "white";
          floatText = `You have <span style='color: red;'>${haveFloatingTokens} </span> locked tokens from previous proposals.<br> You can unlock now by clicking button below.`;
          floatT.innerHTML = floatText;
        } else {
          let floatText = ``;
          sect2.style.display = "inline-block";
          floatT.style.color = "white";
          floatText = `You dont have any locked tokens from previous proposals.`;
          floatT.innerHTML = floatText;
          tRelease.style.display = "none";
        }

        // Only fetch data if there are active proposals
        if (isProposalActive) {
          sect1.style.display = "inline-block";
          sect2.style.display = "inline-block";
          await fetchContractData();
        } else {
          // Display a message indicating there are no active proposals
          contractData.innerHTML = "No active proposals";
        }
      } else {
        status.innerText = "Status: Not Connected or Wrong Network";
      }
    } catch (error) {
      console.error("An error occurred while updating the UI: ", error);
    }
  }

  connectButton.addEventListener("click", async () => {
    if (window.ethereum) {
      try {
        connectButton.disabled = true; // Disable the button during connection process
        connectButton.innerHTML = "Loading"; // Change the button text to "Loading"

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          connectButton.innerHTML = "Connected"; // Change the button text to "Connected" on successful connection
          await updateUI();
        } else {
          // Handle the case where the user cancels the connection or it fails
          connectButton.innerHTML = "Connect"; // Reset the button text
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Connection Failed",
          text: "Could not connect to MetaMask",
        });
        connectButton.innerHTML = "Connect"; // Reset the button text on error
        status.innerText = "Status: Connection failed";
      } finally {
        connectButton.disabled = false; // Re-enable the button
      }
    } else {
      status.innerText = "Status: MetaMask is not installed";
    }
  });

  voteAmountInput.addEventListener("input", () => {
    // Enable the "Vote" button only if the input field is not empty
    if (voteAmountInput.value.trim() === "") {
      voteButton.disabled = true;
    } else {
      voteButton.disabled = false;
    }
  });

  oyla.addEventListener("click", async () => {
    if (voteAmountInput.value.trim() === "") {
      // Display an error message or perform any other action
      Swal.fire({
        icon: "warning",
        title: "Input Required",
        text: "Please enter an amount before voting.",
      });
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const isProposalActive = await contract.methods.proposalActive().call();

      if (accounts.length > 0 && isProposalActive) {
        const userAddress = accounts[0];
        const inputAmount = document.getElementById("vote-amount").value;

        // Convert inputAmount to Wei (assuming it's in Ether)
        const amountInWei = web3.utils.toWei(inputAmount, "ether");

        // Prepare the transaction data
        const txData = {
          from: userAddress,
          to: contractAddress,
          data: contract.methods.vote(true, amountInWei).encodeABI(),
        };

        // Send the transaction
        await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [txData],
        });

        // You can handle the transaction confirmation here
      } else if (!isProposalActive) {
        // If there is no active proposal, show a message in the input placeholder
        document.getElementById("vote-amount").placeholder =
          "No active proposals";
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Transaction Failed",
        text: `An error occurred while sending the transaction: ${error}`,
      });
    }
  });

  window.ethereum.on("accountsChanged", updateUI);
  window.ethereum.on("chainChanged", updateUI);

  updateUI();
});
