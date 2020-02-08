const Web3 = require("web3");

if (window.ethereum) {
  window.web3 = new Web3(window.ethereum);

  window.ethereum
    .enable()
    .then(res => {
      // res[0];
      document.getElementById("artistWallet").value = res[0];
    })
    .catch(err => null);
} else if (window.web3) {
  window.web3 = new Web3(window.web3.currentProvider);
}
