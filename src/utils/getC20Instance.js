import Web3 from 'web3'
import C20Contract from '../../build/contracts/C20.json'
import Config from '../../truffle.js'
import getTransactionReceiptMined from '../utils/getTransactionReceiptMined.js'

const getC20Instance = () => new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', async() => {

    let result
    let web3 = window.web3
    let provider

    if (window.ethereum)
    {
      window.web3 = new Web3(window.ethereum);
      try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          console.log(window.ethereum);
      } catch (error) {
          //alert('access denied');
          console.log('access denied');
      }
    }

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

    result.web3.eth.getTransactionReceiptMined = getTransactionReceiptMined
    const contract = require('truffle-contract')
    const regulator = contract(C20Contract)
    regulator.setProvider(provider)

    const web3RPC = new Web3(provider)

    web3RPC.eth.getAccounts((error, accounts) => {
      result.accounts = accounts

      const c20ContractAddress = (parseInt(web3.version.network, 10) === 1 ? '0x26e75307fc0c021472feb8f727839531f112f317' : '0x2f412497f4ec98b22c7e886af252321b01e0447b')

      return regulator.at(c20ContractAddress).then((c20Instance) => {
        result.c20Instance = c20Instance
        resolve(result)
      })
    })
  })
})

export default getC20Instance
