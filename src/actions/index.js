import request from 'request'

export const actions = {
  UPDATE_PRICE: 'UPDATE_PRICE',
  SAVE_ETHER_PRICE: 'SAVE_ETHER_PRICE',
  SAVE_USER_BALANCE: 'SAVE_USER_BALANCE',
  SAVE_USER: 'SAVE_USER',
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
  return async dispatch => {
    let account
    if (accounts[0] == null)
      account = '0x0000000000000000000000000000000000000000'
    else
      account = accounts[0]

    dispatch({
      type: actions.SAVE_USER,
      userAddress: account
    })

    // TODO:: Put this in it's own 'loadUserBalance' action
    // get the users token balance
    c20Instance.balanceOf(account).then(precisionBalance =>
      {
        console.log(precisionBalance)
        dispatch ({
        type: actions.SAVE_USER_BALANCE,
        precisionBalance
      })}
    )

    // get the price of Ether in USD
    request('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=', (err, response, priceData) => {
      if (err) dispatch ({
        type: actions.SAVE_ETHER_PRICE,
        wasError: true,
      })

      const priceObj = JSON.parse(priceData)

      dispatch ({
        type: actions.SAVE_ETHER_PRICE,
        wasError: false,
        ...priceObj
      })
    })
  }
}
