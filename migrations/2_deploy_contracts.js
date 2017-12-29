var C20 = artifacts.require("./C20.sol");
var C20Vesting = artifacts.require("./C20Vesting.sol");

module.exports = function(deployer) {

  var fundingEndBlock = 20;
  var fundingStartBlock = 0;

  deployer.deploy(C20, "0xfbcf168dfa50b9fd251babebd82dbd8b46a93d36", 300000, fundingStartBlock, fundingEndBlock).then(function(){
    deployer.deploy(C20Vesting, C20.address, fundingEndBlock);
  });

  //deployer.deploy(C20, "0xfbcf168dfa50b9fd251babebd82dbd8b46a93d36", 300000, fundingStartBlock, fundingEndBlock);
  //deployer.deploy(C20Vesting, "0xfbcf168dfa50b9fd251babebd82dbd8b46a93d36", fundingEndBlock);

  // need to then assign vestingContract address within C20 to be C20Vesting contract address
  // vesting = C20Vesting.at("0x074a3ffdf34ad3db95ab898f7054bb0be4bb4424")
  // token = C20.at("0xfd8f06bf029370cdf0326bd2bb45cfc054f1a502")
  // token.setVestingContract(vesting.address)

}
