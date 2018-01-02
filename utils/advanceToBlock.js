// NOTE:: this is very scruffy code, I just needed it to work so that I can test the app (by deploying test data), it is not part of the app in any way.

function advanceBlock(web3) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: Date.now(),
    }, function (err, res) {
      return err ? reject(err) : resolve(res)
    })
  })
}

function advanceToRecursive(number, web3) {
  return new Promise((resolve, reject) => {
    advanceBlock(web3).then(function() {
      return web3.eth.getBlockPromise('latest')
    })
    .then(function(blockNum) {
      if (blockNum.number < number) {
        advanceToRecursive(number, web3).then(
          () => resolve(true)
        )
      } else {
        resolve(true)
      }
    })
  })
}

// Advances the block number so that the last mined block is `number`.
module.exports = function advanceToBlock(number, web3) {
  // if (web3.eth.blockNumber > number) {
  //   throw Error(`block number ${number} is in the past (current is ${web3.eth.blockNumber})`)
  // }

  return new Promise((resolve, reject) => {
    advanceToRecursive(number, web3)
    .then(result => resolve(result))
  })
}
