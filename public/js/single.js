const Web3 = require("web3");
const axios = require("axios");

window.ethereum
  .enable()
  .then(res1 => {
    // res[0];
    document.getElementById("artistWallet").value = res1[0];
    axios
      .get(`/getTokenByCreator/?artist=${res1[0]}`)
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
  })
  .catch(err => null);
