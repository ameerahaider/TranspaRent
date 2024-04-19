const Reviews = artifacts.require("Reviews");
const RentalContract = artifacts.require("RentalContract");
const AgreementFactory = artifacts.require("AgreementFactory");
const DisputeResolution = artifacts.require("DisputeResolution");
const DefaultTerms = artifacts.require("DefaultTerms");
const Payment = artifacts.require("Payment");




module.exports = function (deployer) {
  deployer.deploy(Reviews);
  //deployer.deploy(RentalContract);
  deployer.deploy(DisputeResolution).then(function() {
    return deployer.deploy(DefaultTerms);
  }).then(function() {
    return deployer.deploy(AgreementFactory, DisputeResolution.address, DefaultTerms.address);
  }).then(function() {
    return deployer.deploy(Payment);
  });

};