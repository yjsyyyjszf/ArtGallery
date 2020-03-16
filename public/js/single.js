const Web3 = require("web3");
const axios = require("axios");
const abi = require("./../../abi");

var sPageURL = window.location.href;
var sURLVariables = sPageURL.split("=");
console.log(sURLVariables);
var div = document.getElementById("artistName");
// var artistName = sURLVariables[1].split("%20");
// var artStr = "";
// for (var i = 0; i < artistName.length; i++) artStr += artistName[i] + " ";
window.web3 = new Web3(window.ethereum);
const DRM = new window.web3.eth.Contract(
  abi,
  "0x5268397ad2dc0a1ef5c1fbe3e6bfc239c4ac20fd"
);
getName(DRM, sURLVariables[1]);
async function getName(DRM, wallet) {
  var artists = await DRM.methods.getArtist().call();
  for (var i = 0; i < artists.addresses.length; i++) {
    if (wallet.toUpperCase() == artists.addresses[i].toUpperCase()) {
      div.innerHTML = `Artist - ${artists.names[i]}`;
    }
  }
}

// var infuraLink =
//   "https://rinkeby.infura.io/v3/7a19de34892e4625b8464eac960146b7";
// web3 = new Web3(new Web3.providers.HttpProvider(infuraLink));

axios
  .get(`/getTokenByCreator/?artist=${sURLVariables[1]}`)
  .then(res => {
    // res.data
    var str = "";
    console.log(res);
    for (var i = 0; i < res.data.length; i++) {
      var newDiv = document.createElement("div");
      newDiv.setAttribute("class", "col-sm-6 col-md-4 col-lg-3 col-xl-2 item");
      newDiv.setAttribute("data-aos", "fade");
      newDiv.setAttribute("data-src", `${res.data[i].thumbnail}`);
      newDiv.setAttribute(
        "data-sub-html",
        "<h4>Fading Light</h4><p>Tough guy Mountain</p>"
      );
      var newA = document.createElement("a");
      newA.setAttribute("href", "#");
      var newImg = document.createElement("img");
      newImg.setAttribute("src", `${res.data[i].thumbnail}`);
      newImg.setAttribute("class", `img-fluid`);
      newA.appendChild(newImg);
      newDiv.appendChild(newA);
      var newBtn = document.createElement("button");
      newBtn.innerHTML = "Buy";

      newBtn.setAttribute("value", `${res.data[i].id}`);
      newBtn.onclick = e => {
        window.web3 = new Web3(window.ethereum);
        const DRM = new window.web3.eth.Contract(
          abi,
          "0x5268397ad2dc0a1ef5c1fbe3e6bfc239c4ac20fd"
        );
        let id = e.target.value;
        window.ethereum
          .enable()
          .then(async res => {
            var price = await DRM.methods.tokenPrices(id).call();
            console.log(price);
            DRM.methods.requestBuy(id).send({
              from: res[0],
              gas: "480000",
              value: price,
              gasPrice: web3.utils.toWei("20", "gwei")
            });
          })
          .catch(err => null);
      };
      newDiv.appendChild(newBtn);
      //   str += `<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2 item" data-aos="fade" data-src="${res.data[i].thumbnail}"
      //   data-sub-html="<h4>Fading Light</h4><p>Tough guy Mountain</p>">
      //    <a href="#"><img src="${res.data[i].thumbnail}" alt="IMage" class="img-fluid"></a>
      //  </div>`;
      // str += `<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2 item" data-aos="fade" data-src="${res.data[i].thumbnail}" data-sub-html="<h4>Fading Light</h4><p>Tough guy Mountain</p>"><a href="#">
      // <img src="${res.data[i].thumbnail}" alt="IMage" class="img-fluid"></a></div>`;
      var div = document.getElementById("lightgallery");
      div.appendChild(newDiv);
      console.log(newDiv);
      console.log("APPEND!!!");
      console.log(div);
    }
  })
  .catch(err => alert(err));
