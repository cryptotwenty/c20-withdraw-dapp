export const userType = {
  UNKNOWN: 'UNKNOWN',
  WITHDRAW_ETH: 'WITHDRAW_ETH',
  REQUEST_WITHDRAW: 'REQUEST_WITHDRAW',
}

export const initialState = {
  user: {
    loaded: false,
    userType: userType.UNKNOWN,
    address: "0x0000000000000000000000000000000000000000",
    balance: null,
    isVerified: false,
  },
  price: {
    blockNum: -1,
    txHash: null,
    numerator: null,
    denominator: null,
  }
}
