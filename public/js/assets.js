const Web3 = require("web3");
const axios = require("axios");
const abi = require("../../abi");

if (window.ethereum) {
  window.web3 = new Web3(window.ethereum);

  window.ethereum
    .enable()
    .then(async res => {
      var wallet = res[0];
      var assets = await axios.post("/getOwnerTokens/", { address: wallet });
      console.log(`assets`);
      console.log(assets);
      for (var i = 0; i < assets.data.length; i++) {
        assetSet(assets.data[i]);
      }
    })
    .catch(err => null);
} else if (window.web3) {
  window.web3 = new Web3(window.web3.currentProvider);
} else {
  console.log("no metamask");
  window.location.replace("/metamask");
}
async function assetSet(token) {
  var newDiv = document.createElement("div");
  newDiv.setAttribute("class", "col-sm-6 col-md-4 col-lg-3 col-xl-2 item");
  newDiv.setAttribute("data-aos", "fade");
  newDiv.setAttribute("data-src", `${token.thumbnail}`);
  newDiv.setAttribute("data-sub-html", "<h4>Fading Light</h4>");
  var newA = document.createElement("a");
  newA.setAttribute("href", `/detail?token=${token.id}`);
  var newImg = document.createElement("img");
  newImg.setAttribute("src", `${token.thumbnail}`);
  newImg.setAttribute("class", `img-fluid`);
  newA.appendChild(newImg);
  newDiv.appendChild(newA);
  var div = document.getElementById("lightgallery");
  div.appendChild(newDiv);
}
