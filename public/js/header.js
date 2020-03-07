const Web3 = require("web3");
const axios = require("axios");
console.log('HEADER123123');
$(document).ready(()=>{
  console.log('on load11111');
  axios
  .get(`/registeredArtists/?header=1`)
  .then((res) => {
    // res.data
    for (var i = 0; i < res.data.length; i++) {
      var x = document.createElement("li");
      var y = document.createElement("a");
      y.setAttribute("href", "/single/?artist=" + res.data[i]);
      x.appendChild(y);
      var t = document.createTextNode(`${res.data[i]}`);
      x.appendChild(t);
      x.append(document.getElementById("test"));
      document.getElementById("dropdownlist").appendChild(x);
      console.log(x);
      console.log(document.getElementById("dropdownlist"));
      // myWindow.resizeTo(250, 250);                             // Resizes the new window
      // myWindow.focus();                                        // Sets focus to the new window
    
      // str += `<div class="col-sm-6 col-md-4 col-lg-3 col-xl-2 item" data-aos="fade" data-src="${res.data[i].thumbnail}" data-sub-html="<h4>Fading Light</h4><p>Tough guy Mountain</p>"><a href="#">
      // <img src="${res.data[i].thumbnail}" alt="IMage" class="img-fluid"></a></div>`;
    }
    // var div = document.getElementById("dropdown");
    // div.innerHTML = str;
  })
  .catch(err => alert(err));

});
