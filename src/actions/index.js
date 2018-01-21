import request from 'request'

export const actions = {
  UPDATE_PRICE: 'UPDATE_PRICE',
  SAVE_ETHER_PRICE: 'SAVE_ETHER_PRICE',
  SAVE_USER_BALANCE: 'SAVE_USER_BALANCE',
  SAVE_USER: 'SAVE_USER',
  UPDATE_MINUTE: 'UPDATE_MINUTE',
  INIT_REQUEST: 'INIT_REQUEST',
  SUBMIT_REQUEST: 'SUBMIT_REQUEST',
  COMPLETE_REQUEST: 'COMPLETE_REQUEST',
  RESET_REQUEST: 'RESET_REQUEST',
  INIT_WITHDRAWAL: 'INIT_WITHDRAWAL',
  SUBMIT_WITHDRAWAL: 'SUBMIT_WITHDRAWAL',
  COMPLETE_WITHDRAWAL: 'COMPLETE_WITHDRAWAL',
  RESET_WITHDRAWAL: 'RESET_WITHDRAWAL',
  INIT_SEND: 'INIT_SEND',
  // SUBMIT_SEND: 'SUBMIT_SEND',
  // COMPLETE_SEND: 'COMPLETE_SEND',
  // RESET_SEND: 'RESET_SEND',
  LOAD_USERS_WITHDRAWAL: 'LOAD_USERS_WITHDRAWAL',
  LOAD_USERS_WHITELIST: 'LOAD_USERS_WHITELIST',
  SET_WITHDRAWAL_PRICE: 'SET_WITHDRAWAL_PRICE',
}

// TODO:: remove txHash, it serves no purpose
export const priceUpdate = (c20Instance, numerator, denominator, txHash, blockNum, accounts) => async dispatch => {
  const lastUpdateTime = await c20Instance.previousUpdateTime()
  dispatch({
    type: actions.UPDATE_PRICE,
    numerator,
    denominator,
    txHash,
    lastUpdateTime,
    blockNum,
  })
  dispatch(updateCountdownTimer(true))
  dispatch(loadUsersWithdrawal(c20Instance, accounts[0]))
}


export const loadInitialPrice = (c20Instance, accounts) => async dispatch => {
  const currentPrice = await c20Instance.currentPrice()
  const lastUpdateTime = await c20Instance.previousUpdateTime()

  dispatch({
    type: actions.UPDATE_PRICE,
    numerator: currentPrice[0],
    denominator: currentPrice[1],
    blockNum: 1, // default to 1 since only blocktime is accessible
    lastUpdateTime,
  })
  dispatch(loadUsersWithdrawal(c20Instance, accounts[0]))
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
  if (accounts[0] === null || accounts[0] === undefined)
    account = '0x0000000000000000000000000000000000000000'
  else
    account = accounts[0]

  dispatch({
    type: actions.SAVE_USER,
    userAddress: account
  })

  dispatch(loadUsersWhitelist(c20Instance, account))
  dispatch(loadUserBalance(c20Instance, account))
  dispatch(loadUsersWithdrawal(c20Instance, account))
}



export const loadUsersWhitelist = (c20Instance, account) => dispatch =>
  c20Instance.whitelist(account).then(isWhitelisted => {
    dispatch({
      type: actions.LOAD_USERS_WHITELIST,
      isWhitelisted,
    })
  })

export const loadUsersWithdrawal = (c20Instance, account) => dispatch =>
  c20Instance.withdrawals(account).then(withdrawal => {
    const hasWithdrawal = withdrawal[0].gt('0')
    dispatch({
      type: actions.LOAD_USERS_WITHDRAWAL,
      hasWithdrawal,
      withdrawal,
    })

    if (hasWithdrawal) {
      dispatch(setWithdrawalPrice(c20Instance, withdrawal[1].toNumber()))
    }
  })

export const setWithdrawalPrice = (c20Instance, withdrawalUpdateTime) => dispatch =>
  c20Instance.prices(withdrawalUpdateTime).then(actualizedWithdrawPrice =>
    dispatch({
      type: actions.SET_WITHDRAWAL_PRICE,
      actualizedWithdrawPrice,
    })
  )



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
  request('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD', (err, response, priceData) => {
    if (err) dispatch ({
      type: actions.SAVE_ETHER_PRICE,
      wasError: true,
    })

    const priceObj = JSON.parse(priceData)

    dispatch ({
      type: actions.SAVE_ETHER_PRICE,
      wasError: false,
      price: priceObj[0]['price_usd'],
      price_btc: priceObj[0].price_btc,
      last_updated: priceObj[0].last_updated,
    })
  })

export const requestWithdraw = (c20Instance, web3, accounts, tokensToWithdraw) => async dispatch => {
  dispatch({
    type: actions.INIT_REQUEST
  })
  let tx
  try {
    tx = await c20Instance.requestWithdrawal.sendTransaction(tokensToWithdraw.toString(), {from: accounts[0]})
    dispatch({
      type: actions.SUBMIT_REQUEST,
      tx: tx
    })
  } catch (err) {
    dispatch({
      type: actions.RESET_REQUEST,
      message: 'ERROR: Transaction was declined by your signing agent (Eg MetaMask). Please try again.'
    })
    return
  }

  const mined = await web3.eth.getTransactionReceiptMined(tx)
  const transactionSuccess = mined.status === '0x1'
  dispatch({
    type: actions.COMPLETE_REQUEST,
    mined,
    transactionSuccess,
  })

  dispatch(loadUsersWithdrawal(c20Instance, accounts[0]))
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
