const Web3 = require("web3");
const axios = require("axios");
const abi = require("../../abi");
const BigNumber = require("bignumber.js");

if (window.ethereum) {
  window.web3 = new Web3(window.ethereum);

  window.ethereum
    .enable()
    .then(async res => {
      var sPageURL = window.location.href;
      var sURLVariables = sPageURL.split("=");
      //   console.log(sURLVariables[1]);
      document.getElementById("tokenId").innerHTML = sURLVariables[1];

      var unit = await axios.get(
        "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=IKKPZRZQD3FJ88KSBBQFT4Q7Z9Q8ME6UHC"
      );
      unit = unit.data.result.ethusd;
      document.getElementById("unit").value = unit;

      var wallet = res[0];
      document.getElementById("wallet").innerHTML = wallet;

      //   console.log(`wallet=${wallet}`);
      const DRM = new window.web3.eth.Contract(
        abi,
        "0x55fc1a638bc0fd67c2eba06040aff445d72745c6"
      );
      var owner = await DRM.methods.ownerOf(sURLVariables[1]).call();
      //   console.log(`owner=${owner}`);
      if (owner.toUpperCase() == wallet.toUpperCase()) {
        var artwork = await DRM.methods.artworks(sURLVariables[1]).call();
        document.getElementById("tittle").innerHTML = artwork.name;
        document
          .getElementById("artwork")
          .setAttribute("src", `${artwork.thumbnail}`);
        var button = document.getElementById("submit");
        button.onclick = async () => {
          var id = document.getElementById("tokenId").innerHTML;
          var wallet = document.getElementById("wallet").innerHTML;
          console.log(id, wallet);
          var isApprovedForAll = await DRM.methods
            .isApprovedForAll(
              wallet,
              "0x55fc1a638bc0fd67c2eba06040aff445d72745c6"
            )
            .call();
          if (!isApprovedForAll) {
            await DRM.methods
              .setApprovalForAll(
                "0x55fc1a638bc0fd67c2eba06040aff445d72745c6",
                true
              )
              .send({
                from: wallet,
                gas: "480000",
                gasPrice: web3.utils.toWei("20", "gwei")
              });
          }

          var price = document.getElementById("price").value;
          price = new BigNumber(price * 1000000000000000000);

          await DRM.methods.postToken(id, price.toString()).send({
            from: wallet,
            gas: "480000",
            gasPrice: web3.utils.toWei("20", "gwei")
          });
        };
      } else {
        var tittle = document.getElementById("tittle");
        tittle.innerHTML = "Soory, you don't own this token";
        document.getElementById("resell").hidden = true;
      }
    })
    .catch(err => {
      console.log(err);
      var tittle = document.getElementById("tittle");
      tittle.innerHTML = "Soory, you don't own this token";
      document.getElementById("resell").hidden = true;
    });
} else if (window.web3) {
  window.web3 = new Web3(window.web3.currentProvider);
} else {
  console.log("no metamask");
  window.location.replace("/metamask");
}
