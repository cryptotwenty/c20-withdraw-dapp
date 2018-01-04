// this is purely for testing purposes
const Web3 = require('web3')
const C20Contract = require('./build/contracts/C20.json')
const Config = require('./truffle.js')

// Fallback to localhost if no web3 injection.
const { host, port } = Config.networks[process.env.NODE_ENV]
const provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)

const fundWallet = '0x311cfac8dbf0a58424fcdd8f825287ac9b16407d'
// '0xd64de10c5284cfe62f174f7778fc88eccde2b4ad'
const user1 = '0x7b8f86fda9323ee344887c06c0f197e2c3e162e3'
const user2 = '0xbed7ef659ca044468470aa9efe058a30742f09e6'
const user3 = '0x83e55eefc7acd40927bbc92feec9256dd3cccb55'
const user4 = '0x427f01e979e7fcd9a43292c574f9944e07c576f6'
const user5 = '0x49fd9e466b80439127a1b4dba0eecec31895c119'
const user6 = '0xda1a22729715b3da8c5a8c2a6b2b14fe0f2c755e'

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

    c20Instance.allocatePresaleTokens(user1, 9007199254740991, {from: fundWallet}).then(tx =>
      console.log(tx)
    )
    // c20Instance.allocatePresaleTokens(user2, 9007199254740991, {from: fundWallet}),
    // c20Instance.allocatePresaleTokens(user3, 9007199254740991, {from: fundWallet}),
    // c20Instance.allocatePresaleTokens(user4, 9007199254740991, {from: fundWallet}),
    // c20Instance.allocatePresaleTokens(user5, 9007199254740991, {from: fundWallet}),
  }).catch(err => console.log(err))
})
