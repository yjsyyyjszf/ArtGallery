const Web3 = require("web3");
const abi = require("./abi");
let DRM_address = "0x987b12fbbdc0d2ebac5e7b8b8c79f0dde7bd5442";
let DRM_owner = "0x5efDD3CAb3c3Ea3D1725B8EaF340Cc8d5a9B7547";
let DRM_ownerKey =
  "45F93E7A6CF774228519708AA97529A9CE2A663E26E67F183FE49BB9C90D468D";

var infuraLink =
  "https://rinkeby.infura.io/v3/7a19de34892e4625b8464eac960146b7";
web3 = new Web3(new Web3.providers.HttpProvider(infuraLink));
let DRM = new web3.eth.Contract(abi, DRM_address);

module.exports = {
  DRM: DRM,
  DRM_owner: DRM_owner,
  DRM_address: DRM_address,
  DRM_ownerKey: DRM_ownerKey
};
