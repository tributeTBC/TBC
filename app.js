import { contractAddress, ABI } from "./abi.js";

document.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connect-button");
  const status = document.getElementById("status");
  const contractData = document.getElementById("contract-data");
  const txButton1 = document.getElementById("tx-button1");
  const txButton2 = document.getElementById("tx-button2");

  let web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(ABI, contractAddress);

  const predefinedNetworkId = "0x15eb";

  async function fetchContractData() {
    try {
      const currentTotalSupply = await web3.eth.call({
        to: contractAddress,
        data: contract.methods.currentTotalSupply().encodeABI(),
      });
      const developer = await web3.eth.call({
        to: contractAddress,
        data: contract.methods.developer().encodeABI(),
      });

      contractData.innerHTML = `<p>Current Total Supply: ${web3.utils.hexToNumberString(
        currentTotalSupply
      )}</p><p>Developer: ${web3.utils.hexToString(developer)}</p>`;
    } catch (error) {
      console.error("An error occurred while fetching data: ", error);
    }
  }

  txButton1.addEventListener("click", async () => {
    try {
      const inFavor = true; // Replace with actual value
      const amount = 10; // Replace with actual value
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      }); // Define accounts here

      const txData = contract.methods.vote(inFavor, amount).encodeABI();

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: contractAddress,
            data: txData,
          },
        ],
      });

      alert("Vote transaction sent!");
    } catch (error) {
      console.error(
        "An error occurred while sending the vote transaction: ",
        error
      );
      alert("Vote transaction failed!");
    }
  });

  async function updateUI() {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0 && chainId === predefinedNetworkId) {
      status.innerText = `Status: Connected to ${accounts[0]} on chain ${chainId}`;
      await fetchContractData();
      txButton1.style.display = "inline-block";
      txButton2.style.display = "inline-block";
    } else {
      status.innerText = "Status: Not Connected or Wrong Network";
      txButton1.style.display = "none";
      txButton2.style.display = "none";
    }
  }

  connectButton.addEventListener("click", async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await updateUI();
      } catch (error) {
        status.innerText = "Status: Connection failed";
      }
    } else {
      status.innerText = "Status: MetaMask is not installed";
    }
  });

  window.ethereum.on("accountsChanged", updateUI);
  window.ethereum.on("chainChanged", updateUI);

  updateUI();
});
