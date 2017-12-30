export const actions = {
  UPDATE_PRICE: 'UPDATE_PRICE'
}

export const priceUpdate = (numerator, denominator, txHash, blockNum) => {
  return {
    type: actions.UPDATE_PRICE,
    numerator,
    denominator,
    txHash,
    blockNum,
  }
}

export const loadUser = (c20Instance, web3, accounts) => {

}
