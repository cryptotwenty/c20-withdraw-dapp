import Web3 from 'web3'
import C20Contract from '../../build/contracts/C20.json'
import Config from '../../truffle.js'

const getC20Instance = () => new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    let result
    let web3 = window.web3
    let provider

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      provider = web3.currentProvider
      console.log('Injected web3 detected.');
    } else {
      // Fallback to localhost if no web3 injection.
      const { host, port } = Config.networks[process.env.NODE_ENV]
      provider = new Web3.providers.HttpProvider('http://' + host + ':' + port)

      console.log('No web3 instance injected, using Local web3.')
    }

    web3 = new Web3(provider)
    result = {
      web3: web3
    }
    const contract = require('truffle-contract')
    const regulator = contract(C20Contract)
    regulator.setProvider(provider)

    const web3RPC = new Web3(provider)

    web3RPC.eth.getAccounts((error, accounts) => {
      result.accounts = accounts
      return regulator.at('0x2f412497f4ec98b22c7e886af252321b01e0447b').then((c20Instance) => {
        result.c20Instance = c20Instance
        resolve(result)
      })
    })
  })
})

export default getC20Instance
