const Migrations = artifacts.require("Migrations");
const E = artifacts.require("EngraveNFT1155");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(E);
};