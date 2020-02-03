// const Web3 = require('web3');
const axios = require('axios');
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
  axios
  .get(`http://localhost:8080/getOnStoreTokens/`)
  .then(res => {
    // res.data
    var tableStr = "";
    for(var i=0;i<res.data.length;i++){
      console.log(res.data[i]);
      tableStr+="<tr><td>"+res.data[i]+"</td></tr>";
    }
    document.getElementById("shop").innerHTML = tableStr;
  })
  .catch(err => alert(err))
