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
  INIT_WITHDRAWAL: 'INIT_WITHDRAWAL',
  SUBMIT_WITHDRAWAL: 'SUBMIT_WITHDRAWAL',
  COMPLETE_WITHDRAWAL: 'COMPLETE_WITHDRAWAL',
  INIT_SEND: 'INIT_SEND',
  SUBMIT_SEND: 'SUBMIT_SEND',
  COMPLETE_SEND: 'COMPLETE_SEND',
  LOAD_USERS_WITHDRAWAL: 'LOAD_USERS_WITHDRAWAL',
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

  c20Instance.withdrawals(accounts[0]).then(withdrawal => {
      const hasWithdrawal = withdrawal[0].gt('0')

      dispatch({
        type: actions.LOAD_USERS_WITHDRAWAL,
        hasWithdrawal,
        withdrawal,
      })
    }
  )
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

  const tx = await c20Instance.requestWithdrawal.sendTransaction(tokensToWithdraw, {from: accounts[0]})
  dispatch({
    type: actions.SUBMIT_REQUEST,
    tx: tx
  })

  const mined = await web3.eth.getTransactionReceiptMined(tx)
  dispatch({
    type: actions.COMPLETE_REQUEST,
    mined
  })
}

export const transferTokens = (c20Instance, web3, accounts, to, amount) => async dispatch => {
  dispatch({
    type: actions.INIT_SEND
  })

  const tx = await c20Instance.transfer.sendTransaction(to, amount, {from: accounts[0]})
  dispatch({
    type: actions.SUBMIT_SEND,
    tx: tx
  })

  const mined = await web3.eth.getTransactionReceiptMined(tx)
  dispatch({
    type: actions.COMPLETE_SEND,
    mined
  })
}

export const executeWithdraw = (c20Instance, web3, accounts) => async dispatch => {
  dispatch({
    type: actions.INIT_WITHDRAWAL
  })

  const tx = await c20Instance.withdraw.sendTransaction({from: accounts[0]})
  dispatch({
    type: actions.SUBMIT_WITHDRAWAL,
    tx: tx
  })

  const mined = await web3.eth.getTransactionReceiptMined(tx)
  dispatch({
    type: actions.COMPLETE_WITHDRAWAL,
    mined
  })
}
