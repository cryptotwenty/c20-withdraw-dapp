import request from 'request'

export const actions = {
  UPDATE_PRICE: 'UPDATE_PRICE',
  SAVE_ETHER_PRICE: 'SAVE_ETHER_PRICE',
  SAVE_USER_BALANCE: 'SAVE_USER_BALANCE',
  SAVE_USER: 'SAVE_USER',
}

// TODO:: remove txHash, it serves no purpose
export const priceUpdate = (numerator, denominator, txHash, blockNum) => ({
  type: actions.UPDATE_PRICE,
  numerator,
  denominator,
  txHash,
  blockNum,
})


export const loadInitialPrice = (c20Instance, web3, accounts) => async dispatch => {
  // const previousUpdateTime = await c20Instance.previousUpdateTime()
  const currentPrice = await c20Instance.currentPrice()

  return {
    type: actions.UPDATE_PRICE,
    numerator: currentPrice.numerator,
    denominator: currentPrice.denominator,
    blockNum: 1, // default to 1 since blocktime is not accessible
  }
}

export const loadUser = (c20Instance, accounts) => async dispatch => {
  let account
  if (accounts[0] == null)
    account = '0x0000000000000000000000000000000000000000'
  else
    account = accounts[0]

  dispatch({
    type: actions.SAVE_USER,
    userAddress: account
  })

  dispatch(loadUserBalance(c20Instance, account))
}

// get the users token balance
export const loadUserBalance = (c20Instance, account) => dispatch =>
  c20Instance.balanceOf(account).then(precisionBalance =>
    dispatch ({
      type: actions.SAVE_USER_BALANCE,
      precisionBalance
    })
  )

// get the price of Ether in USD
export const getEtherPrice = displayCurrency => dispatch =>
  request('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=' + 'USD', (err, response, priceData) => {
    if (err) dispatch ({
      type: actions.SAVE_ETHER_PRICE,
      wasError: true,
    })

    const priceObj = JSON.parse(priceData)

    dispatch ({
      type: actions.SAVE_ETHER_PRICE,
      wasError: false,
      price: priceObj[0]['price_' + 'usd'],
      price_btc: priceObj[0].price_btc,
      last_updated: priceObj[0].last_updated,
    })
  })
