const Web3 = require("web3");
const axios = require("axios");
const axios2 = require("axios");
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
window.ethereum
  .enable()
  .then(res => {
    // res[0];
    document.getElementById("artistWallet").value = res[0];
  })
  .catch(err => null);
// axios2.defaults.headers.common["x-api-key"] =
//   "jReCGk34kJ6TdpxQ1tsWf3H3bUUaOpXW2kO8sZUI";
axios2
  .get(
    "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=IKKPZRZQD3FJ88KSBBQFT4Q7Z9Q8ME6UHC"
  )
  .then(res => {
    document.getElementById("unit").value = res.data.result.ethusd;
  });

axios
  .get(`/registeredArtists/`)
  .then(res => {
    // res.data
    var str = "";
    console.log(res.data);
    for (var i = 0; i < res.data.length; i++) {
      str += `<option value='${i}'>` + res.data[i] + "</option>";
    }
    var select = document.getElementById("contributors");
    select.innerHTML = str;
    select.onchange = function() {
      var selected1 = [];
      var perStr = "";
      var num = 0;
      for (var i = 0; i < select.length; i++) {
        if (select.options[i].selected) {
          num++;
          var index = select.options[i].value;
          perStr += `<label>${res.data[index]}</label><input type='number' name='percentages[]' class='form-control' min='1' max='9'>`;
          if (num > 1) {
            // selected1.push(select.options[i].value);
            document.getElementById("percentages").innerHTML = perStr;
          } else document.getElementById("percentages").innerHTML = "";
        }
      }
    };
  })
  .catch(err => alert(err));
