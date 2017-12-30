var C20 = artifacts.require("./C20.sol");
var C20Vesting = artifacts.require("./C20Vesting.sol");

module.exports = (deployer, network, accounts) => {
  const fundingStartBlock = 0;
  const fundingEndBlock = 2;
  const fundWallet = accounts[0]
  const controlWallet = accounts[1]

  deployer.deploy(C20, controlWallet, 300000, fundingStartBlock, fundingEndBlock)
  // do some test stuff here:
  .then(() => C20.deployed())
  .then(c20Instance => {
    c20Instance.updatePrice(300001, {from: fundWallet})
    c20Instance.updatePrice(300002, {from: fundWallet})
    c20Instance.updatePrice(299999, {from: fundWallet})
  })
}
