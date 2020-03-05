const Web3 = require("web3");
const axios = require("axios");
console.log("HEADER!!!");
axios
  .get(`/registeredArtists/?header=1`)
  .then(res => {
    // res.data
    for (var i = 0; i < res.data.length; i++) {
      var x = document.createElement("LI");
      var t = document.createTextNode(res.data[i]);
      x.appendChild(t);
      document.getElementById("dropdown").appendChild(x);
      console.log(res.data[i]);

      // str += `<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2 item" data-aos="fade" data-src="${res.data[i].thumbnail}" data-sub-html="<h4>Fading Light</h4><p>Tough guy Mountain</p>"><a href="#">
      // <img src="${res.data[i].thumbnail}" alt="IMage" class="img-fluid"></a></div>`;
    }
    // var div = document.getElementById("dropdown");
    // div.innerHTML = str;
  })
  .catch(err => alert(err));
