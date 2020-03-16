const Web3 = require("web3");
const axios = require("axios");
// if (window.ethereum) {
//     window.web3 = new Web3(window.ethereum);

//     window.ethereum
//       .enable()
//       .then(res => {
//         document.getElementById("wallet").innerHTML = res[0];

//       })
//       .catch(err => null);
//   } else if (window.web3) {
//     window.web3 = new Web3(window.web3.currentProvider);
//   }
function buy(input) {
  console.log(input);
}
axios
  .get(`/getOnStoreTokens/`)
  .then(res => {
    // res.data
    var tableStr = "";
    console.log(res);
    for (var i = 0; i < res.data.length; i++) {
      tableStr += `<div class="swiper-slide">
        <div class="image-wrap">
          <div class="image-info">
            <h2 class="mb-3" id="artist">${res.data[i].artist}</h2>
            <a href="/single/?artist=${res.data[i].owner}" id="thumbnail" class="btn btn-outline-white py-2 px-4">More Photos</a>
          </div>
          <img src="${res.data[i].thumbnail}" alt="Image">
        </div>
      </div>`;
    }
    console.log(tableStr);
    document.getElementById("shop").innerHTML = tableStr;
  })
  .catch(err => alert(err));
