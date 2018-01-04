import request from 'request'
import BigNumber from 'bignumber.js'

const pow18 = new BigNumber('1000000000000000000')

export const actions = {
  UPDATE_PRICE: 'UPDATE_PRICE',
  SAVE_ETHER_PRICE: 'SAVE_ETHER_PRICE',
  SAVE_USER_BALANCE: 'SAVE_USER_BALANCE',
  SAVE_USER: 'SAVE_USER',
  UPDATE_MINUTE: 'UPDATE_MINUTE',
  INIT_REQUEST: 'INIT_REQUEST',
  SUBMIT_REQUEST: 'SUBMIT_REQUEST',
  COMPLETE_REQUEST: 'COMPLETE_REQUEST',
}

// TODO:: remove txHash, it serves no purpose
export const priceUpdate = (numerator, denominator, txHash, blockNum) => dispatch => {
  dispatch({
    type: actions.UPDATE_PRICE,
    numerator,
    denominator,
    txHash,
    blockNum,
  })
  dispatch(updateCountdownTimer(true))
}


export const loadInitialPrice = (c20Instance, accounts) => async dispatch => {
  const currentPrice = await c20Instance.currentPrice()

  dispatch({
    type: actions.UPDATE_PRICE,
    numerator: currentPrice[0],
    denominator: currentPrice[1],
    blockNum: 1, // default to 1 since only blocktime is accessible
  })
}

export const updateCountdownTimer = (wasUpdate = false) => ({
  type: actions.UPDATE_MINUTE,
  minute: (new Date().getMinutes()),
  wasUpdate,
})


// NOTE:: Unused, not needed
export const updateUpdateTime = (c20Instance, accounts) => async dispatch => {
  const previousUpdateTime = await c20Instance.previousUpdateTime()

  return {
    type: actions.UPDATE_UPDATE_TIME,
    previousUpdateTime,
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

export const requestWithdraw = (c20Instance, web3, accounts, tokensToWithdraw) => async dispatch => {
  dispatch({
    type: actions.INIT_REQUEST
  })

  const tx = await c20Instance.transfer.sendTransaction('0x788a601b5eaa00a8b0bfd91d90e65ea1567ce6af', pow18.mul(tokensToWithdraw), {from: accounts[0]})
  // const tx = await c20Instance.requestWithdrawal.sendTransaction(tokensToWithdraw, {from: accounts[0]})
  dispatch({
    type: actions.SUBMIT_REQUEST,
    tx: tx.tx
  })

  const mined = await web3.eth.getTransactionReceiptMined(tx)
  dispatch({
    type: actions.COMPLETE_REQUEST,
    mined
  })
}
