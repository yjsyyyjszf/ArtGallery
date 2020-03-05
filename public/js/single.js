const Web3 = require("web3");
const axios = require("axios");

var sPageURL = window.location.href;
var sURLVariables = sPageURL.split("=");
console.log(sURLVariables);
var div = document.getElementById("artistName");
div.innerHTML = `Artist - ${sURLVariables[1]}`;

axios
  .get(`/getTokenByCreator/?artist=${sURLVariables[1]}`)
  .then(res => {
    // res.data
    var str = "";
    console.log(res);
    for (var i = 0; i < res.data.length; i++) {
      str += `<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2 item" data-aos="fade" data-src="${res.data[i].thumbnail}"
      data-sub-html="<h4>Fading Light</h4><p>Tough guy Mountain</p>">
       <a href="#"><img src="${res.data[i].thumbnail}" alt="IMage" class="img-fluid"></a>
     </div>`;
      // str += `<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2 item" data-aos="fade" data-src="${res.data[i].thumbnail}" data-sub-html="<h4>Fading Light</h4><p>Tough guy Mountain</p>"><a href="#">
      // <img src="${res.data[i].thumbnail}" alt="IMage" class="img-fluid"></a></div>`;
    }
    var div = document.getElementById("lightgallery");
    div.innerHTML = str;
  })
  .catch(err => alert(err));
