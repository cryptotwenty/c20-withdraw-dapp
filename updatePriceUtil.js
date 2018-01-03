// this is purely for testing purposes
const Web3 = require('web3')
const C20Contract = require('./build/contracts/C20.json')
const Config = require('./truffle.js')

// Fallback to localhost if no web3 injection.
const { host, port } = Config.networks[process.env.NODE_ENV]
const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)

const web3 = new Web3(provider)
result = {
  web3: web3
}
const contract = require('truffle-contract')
const c20 = contract(C20Contract)
c20.setProvider(provider)

const web3RPC = new Web3(provider)

web3RPC.eth.getAccounts((error, accounts) => {

  c20.deployed()
  .then((c20Instance) => {
    c20Instance.updatePrice(1, {from: accounts[0]}).then(
      console.log('priceIsUpdated')
    )
  }).catch(err => console.log(err))
})
