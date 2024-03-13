const Reviews = artifacts.require("Reviews");

module.exports = function (deployer) {
  deployer.deploy(Reviews);
};
