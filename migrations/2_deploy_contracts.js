// NOTE:: if this doesn't work, use remix and the following in the arguments
// "address", 30000, 1, <blockenum>
// "address", "9007199254740991000"
const C20 = artifacts.require("./C20.sol");
const C20Vesting = artifacts.require("./C20Vesting.sol");
const config = require("../truffle.js")
const advanceToBlock = require('../utils/advanceToBlock')
const Web3 = require('web3')
const Promise = require("bluebird")
Promise.allNamed = require("../utils/sequentialPromiseNamed.js")

module.exports = (deployer, network, accounts) => {

  let web3
  if (network == 'development') {
    const {
      host,
      port,
    } = config.networks[network]
    web3 = new Web3(new Web3.providers.HttpProvider('http://'+host+':'+port))
  } else {
    console.log('We are only able to deploy to a local dev network.')
    console.log('To deploy anywhere else you need to set that up.')
    return
  }

  if (typeof web3.eth.getAccountsPromise === "undefined") {
    Promise.promisifyAll(web3.eth, { suffix: "Promise" })
  }
  console.log('funding end block...')
  web3.eth.getBlockPromise('latest').then(block => {
      console.log('funding end block...')
      const fundingStartBlock = 0
      const fundingEndBlock = 50
      console.log("funding ends on block:", fundingEndBlock)
      const fundWallet = accounts[0]
      const controlWallet = accounts[1]
      const user1 = accounts[2]
      const user2 = accounts[3]
      const user3 = accounts[4]
      const user4 = accounts[5]
      const user5 = accounts[6]
      const dummyVesting = accounts[9]
      let c20Instance, vestingInstance

      return deployer.deploy(C20, controlWallet, 300000, fundingStartBlock, fundingEndBlock, {from: fundWallet, gas: 5000000})
      .then(() =>{
        console.log('c20deployed')
        return deployer.deploy(C20Vesting, C20.address, fundingEndBlock, {from: fundWallet})
      })
      .then(() =>{
          console.log('vesting deployed')
         return Promise.allNamed({
          c20I: () => C20.deployed(),
          vestingI: () => C20Vesting.deployed()
        })}
      )
      .then(instances => {
        c20Instance = instances.c20I
        vestingInstance = instances.vestingI
        console.log('got both instances')
        console.log('vestingInstance.address', vestingInstance.address)
        return Promise.all(
          [
            c20Instance.setVestingContract(vestingInstance.address, {from: fundWallet}),
            c20Instance.verifyParticipant(user1, {from: fundWallet}),
            c20Instance.verifyParticipant(user2, {from: fundWallet}),
            c20Instance.verifyParticipant(user3, {from: fundWallet}),
            c20Instance.verifyParticipant(user4, {from: fundWallet}),
            c20Instance.verifyParticipant(user5, {from: fundWallet}),
          ]
        )
      })
      // // 9007199254740992 <- largest integer in javascript, lol
      .then(
        () => {
          console.log('all participants verified')
          return Promise.all([
            c20Instance.allocatePresaleTokens(user1, 9007199254740991, {from: fundWallet}),
            c20Instance.allocatePresaleTokens(user2, 9007199254740991, {from: fundWallet}),
            c20Instance.allocatePresaleTokens(user3, 9007199254740991, {from: fundWallet}),
            c20Instance.allocatePresaleTokens(user4, 9007199254740991, {from: fundWallet}),
            c20Instance.allocatePresaleTokens(user5, 9007199254740991, {from: fundWallet}),
          ])
        }
      )
      .then(() => console.log('allocated for #1 #2 #3 #4 #5'))
    // })
  }
