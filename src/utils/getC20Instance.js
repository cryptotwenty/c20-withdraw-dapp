import Web3 from 'web3'
import C20Contract from '../../contracts/C20.json'
import Config from '../../truffle.js'
import getTransactionReceiptMined from '../utils/getTransactionReceiptMined.js'

const getC20Instance = () => 
new Promise((resolve, reject) => {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener("load", async () => {
    let result
    if (window.ethereum) {
      window.ethereum.autoRefreshOnNetworkChange = false;
      const web3 = new Web3(window.ethereum);
      const enable = async () => {
        try {
          await window.ethereum.enable();
        } catch (e) {
          //   todo Beni handle errors like 
          // "User denied account authorization"
          console.error(e)
        }
      };
      await enable();

      result = {
        web3: web3
      }
      result.accounts = await web3.eth.getAccounts();

      var c20ContractAddress = (parseInt(web3.currentProvider.networkVersion, 10) === 1 ? '0x26e75307fc0c021472feb8f727839531f112f317' : '0x2f412497f4ec98b22c7e886af252321b01e0447b')

      result.web3.eth.getTransactionReceiptMined = getTransactionReceiptMined
      

      const contract = require('truffle-contract')
      const regulator = contract(C20Contract)
      regulator.setProvider(web3.currentProvider)

        
      return regulator.at(c20ContractAddress).then((c20Instance) => {
        result.c20Instance = c20Instance
        resolve(result)
      })
    }
  })
})

export default getC20Instance
