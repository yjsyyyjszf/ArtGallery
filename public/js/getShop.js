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
  .get(`http://localhost:8080/getOnStoreTokens/`)
  .then(res => {
    // res.data
    var tableStr = "";
    console.log(res);
    for (var i = 0; i < res.data.length; i++) {
      tableStr +=
        "<tr><td>" +
        res.data[i][0] +
        "<br>" +
        res.data[i][1] +
        "<br>" +
        res.data[i][2] +
        "<br>" +
        res.data[i][3] +
        "<br>" +
        "<img src='" +
        res.data[i][4] +
        "'><br>" +
        "<button type='button' onclick='" +
        i +
        ")'>" +
        "Buy!" +
        "</button>" +
        "</td></tr>";
    }

    document.getElementById("shop").innerHTML = tableStr;
  })
  .catch(err => alert(err));
