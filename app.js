import { contractAddress, ABI, tokenAd, tABI } from "./abi.js";

document.addEventListener("DOMContentLoaded", () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const connectButton = document.getElementById("connect-button");
  const status = document.getElementById("status");
  const isSmall = window.innerWidth < 800;
  if (isMobile || isSmall) {
    status.innerHTML =
      "<span style='color: white; font-size:32px;'>Please Use desktop to Vote</span>";
    connectButton.style.display = "none";
    return; // Stop further execution
  }

  const contractData = document.getElementById("contract-data");
  const sect1 = document.getElementById("info-section");
  const sect2 = document.getElementById("vote-section");
  const floatT = document.getElementById("floatT");
  const oyla = document.getElementById("tx-button1");
  const tRelease = document.getElementById("tx-button2");
  const voteAmountInput = document.getElementById("vote-amount");
  const voteButton = document.getElementById("tx-button1");
  const vText = document.getElementById("vote");
  const vInput = document.getElementById("vote-input");

  let web3 = new Web3(window.ethereum);
  let isProposalActive = false;
  let haveFloatingTokens = 0;
  const contract = new web3.eth.Contract(ABI, contractAddress);

  const predefinedNetworkId = "";

  async function fetchContractData() {
    try {
      contractData.innerHTML = `<span style='color: white;'>Loading proposal data please wait.</span>`;
      // Fetch contract information here
      const isProposalActive = await contract.methods.proposalActive().call();

      // Create explanations based on contract data
      let infoText = ``;
      let vTextr = ``;
      if (isProposalActive) {
        infoText +=
          "<span class='green-text'>There is an active proposal</span><br>";
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

      infoText += `Proposal ID: <span class='green-text'>${proposalId}</span><br>`;
      infoText += `Proposal Amount: <span class='green-text'>${proposalAmount} TBC </span><br>`;
      infoText += `Proposal Description: <span class='green-text'>${proposalDescription}</span><br>`;
      infoText += `Votes In Favor: <span class='green-text'>${votesInFavor} TBC</span><br>`;
      infoText += `Required Votes: <span class='green-text'>${requiredVotes} TBC</span><br>`;

      // Convert proposalExpiry to a human-readable date format (EU format)
      const proposalExpiryDate =
        new Date(proposalExpiry * 1000).toLocaleDateString("en-GB") +
        " " +
        new Date(proposalExpiry * 1000).toLocaleTimeString();

      infoText += `Proposal Expiry Date: <span class='green-text'>${proposalExpiryDate}</span><br>`;

      vTextr = `<span class='headtext'>Vote for Proposal:<span class='green-text'>${proposalId}</span></span>`;
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
      const networkDetails = await getNetworkDetails();
      //console.log("Value of this: ", this);
      const currentChainId = await web3.eth.getChainId();
      // Check if there are active proposals before updating the UI
      console.log("Value of this: ", `0x${currentChainId.toString(16)}`);
      console.log("Value of this: ", networkDetails.chainId);
      if (
        accounts.length > 0 &&
        `0x${currentChainId.toString(16)}` !== networkDetails.chainId
      ) {
        console.log(`Current Chain ID: 0x${currentChainId.toString(16)}`);
        console.log(`Expected Chain ID from file: ${networkDetails.chainId}`);
        status.innerHTML = `Connected : Current Chain ID: 0x${currentChainId.toString(
          16
        )}.<br>Please Connect Chain ID : ${networkDetails.chainId}`;
        return;
      }

      const tokenContract = new web3.eth.Contract(tABI, tokenAd);
      const balance = await tokenContract.methods.balanceOf(accounts[0]).call();
      const balanceInEther = Number(
        web3.utils.fromWei(balance, "ether")
      ).toLocaleString();
      document.getElementById(
        "account-balance"
      ).innerHTML = `<br><span style='font-size: 22px;'>You have: <span class='green-text'>${balanceInEther}</span> TBC</span>`;

      isProposalActive = await contract.methods.proposalActive().call();
      haveFloatingTokens =
        Number(await contract.methods.getUnlockedTokens(accounts[0]).call()) /
        1e18;
      console.log(
        Number(contract.methods.getLastVotedProposalId(accounts[0]).call())
      );
      let userCurrent;
      try {
        userCurrent = await contract.methods
          .getLastVotedProposalId(accounts[0])
          .call();
        userCurrent = userCurrent.toString(); // Convert BigInt to string
      } catch (error) {
        userCurrent = "0";
      }

      let pCurrent;
      try {
        pCurrent = await contract.methods.proposalId().call();
        pCurrent = pCurrent.toString(); // Convert BigInt to string
      } catch (error) {
        pCurrent = "0";
      }

      if (accounts.length > 0 && chainId === networkDetails.chainId) {
        connectButton.disabled = true; // Disable the button during connection process
        connectButton.innerHTML = `<span style='color:green;'>Connected</span>`; // Change the button text to "Loading"
        status.innerHTML = `<span style='font-size: 24px;'>Status: Connected to ${accounts[0]} on chain ${chainId}</span>`;
        //txButton1.style.display = "hidden";
        //txButton2.style.display = "inline-block";
        if (userCurrent === pCurrent) {
          let greenTokens;
          greenTokens = (
            Number(await contract.methods.lockedTokens(accounts[0]).call()) /
            1e18
          ).toLocaleString();
          let floatText;
          sect2.style.display = "inline-block";
          floatT.style.color = "white";
          tRelease.style.display = "none";
          floatText = `You have <span class='green-text'>${greenTokens} </span> locked TBC tokens for this proposal round. You can vote for more.`;
          floatT.innerHTML = floatText;
          if (!isProposalActive) {
            tRelease.style.display = "inline-block";
            voteAmountInput.style.display = "none";
            oyla.style.display = "none";
            vInput.style.display = "none";
          }
        }
        if (haveFloatingTokens > 0 && userCurrent !== pCurrent) {
          let floatText = ``;
          sect2.style.display = "inline-block";
          floatT.style.color = "white";
          floatText = `You have <span class='green-text'>${haveFloatingTokens} </span> locked TBC tokens from previous proposals.<br> You can unlock now by clicking button below.`;
          if (isProposalActive) {
            floatText += `<br><br><span class='red-text'>You need to Unlock tokens to participate new proposals.</span>`;
          }
          floatT.innerHTML = floatText;
          tRelease.style.display = "inline-block";
          voteAmountInput.style.display = "none";
          oyla.style.display = "none";
          vInput.style.display = "none";
          vText.innerText = "There are no active proposals right now.";
        } else if (haveFloatingTokens == 0 && userCurrent !== pCurrent) {
          console.log(haveFloatingTokens);
          let floatText = ``;
          if (!isProposalActive) {
            voteAmountInput.style.display = "none";
            oyla.style.display = "none";
            vInput.style.display = "none";
            vText.innerText = "There are no active proposals right now.";
          }
          sect2.style.display = "inline-block";
          floatT.style.color = "white";
          if (isProposalActive) {
            floatText = `<span class='red-text'>Please participate to proposal by locking tokens, devs need your vote!</span>`;
            floatT.innerHTML = floatText;
            tRelease.style.display = "none";
          } else {
            floatText = `<span class='red-text'> Lets wait for next proposal!</span>`;
            floatT.innerHTML = floatText;
            tRelease.style.display = "none";
          }
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
    checkNetwork();
    if (window.ethereum) {
      try {
        connectButton.disabled = true; // Disable the button during connection process
        connectButton.innerHTML = "Loading"; // Change the button text to "Loading"

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          connectButton.innerHTML = "Connect"; // Change the button text to "Connected" on successful connection
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

        const amountInWei = web3.utils.toWei(inputAmount, "ether");

        const txData = {
          from: userAddress,
          to: contractAddress,
          data: contract.methods.vote(true, amountInWei).encodeABI(),
        };

        await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [txData],
        });

        // Display success modal
        Swal.fire({
          icon: "success",
          title: "Transaction Successful",
          text: "Your vote has been cast. Please wait atleast 30 seconds.",
        }).then(() => {
          setTimeout(async () => {
            location.reload();
          }, 25000);
        });

        // Re-fetch proposal data to update UI
      } else if (!isProposalActive) {
        document.getElementById("vote-amount").placeholder =
          "No active proposals";
      }
    } catch (error) {
      // Display failure modal
      Swal.fire({
        icon: "error",
        title: "Transaction Failed",
        text: `An error occurred while sending the transaction: ${error}`,
      });
    }
  });
  tRelease.addEventListener("click", async () => {
    try {
      // Request accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const userAddress = accounts[0];

        // Prepare the transaction data for unlockTokens
        const txData = {
          from: userAddress,
          to: contractAddress,
          data: contract.methods.unlockTokens().encodeABI(),
        };

        // Send the transaction
        await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [txData],
        });

        // Display success modal
        Swal.fire({
          icon: "success",
          title: "Transaction Successful",
          text: "Your tokens have been unlocked. Please wait at least 30 seconds.",
        }).then(() => {
          setTimeout(async () => {
            location.reload();
          }, 25000);
        });
      }
    } catch (error) {
      // Display failure modal
      Swal.fire({
        icon: "error",
        title: "Transaction Failed",
        text: `An error occurred while sending the transaction: ${error}`,
      });
    }
  });

  async function checkNetwork() {
    const networkDetails = await getNetworkDetails();
    const currentChainId = await web3.eth.getChainId();
    console.log(`Current Chain ID: 0x${currentChainId.toString(16)}`);
    console.log(`Expected Chain ID from file: ${networkDetails.chainId}`);

    if (`0x${currentChainId.toString(16)}` !== networkDetails.chainId) {
      let userConfirmed = false;

      await Swal.fire({
        title: "Network Mismatch",
        text: "You're connected to the wrong network. Would you like to switch?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, switch!",
        cancelButtonText: "No, thanks",
      }).then((result) => {
        userConfirmed = result.isConfirmed;
      });

      if (userConfirmed) {
        try {
          // First, try switching to the chain
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: networkDetails.chainId }],
          });
          return true;
        } catch (switchError) {
          console.error("Error switching chains:", switchError);

          // If the error code indicates the chain is not added, then try adding it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [networkDetails],
              });
              return true;
            } catch (addError) {
              await Swal.fire({
                title: "Error",
                text: "Failed to add or switch to the network. Please switch manually.",
                icon: "error",
              });
              return false;
            }
          } else {
            await Swal.fire({
              title: "Error",
              text: "Failed to switch network. Please switch manually.",
              icon: "error",
            });
            return false;
          }
        }
      } else {
        return false;
      }
    }
    return true;
  }
  async function getNetworkDetails() {
    const response = await fetch("networks.json");
    const data = await response.json();
    return data.desiredNetwork;
  }
  window.ethereum.on("accountsChanged", updateUI);
  window.ethereum.on("chainChanged", updateUI);

  updateUI();
});
