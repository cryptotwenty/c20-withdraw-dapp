export const userType = {
  UNKNOWN: 'UNKNOWN',
  WITHDRAW_ETH: 'WITHDRAW_ETH',
  REQUEST_WITHDRAW: 'REQUEST_WITHDRAW',
}

export const currency = {
  AUD: "AUD",
  BRL: "BRL",
  CAD: "CAD",
  CHF: "CHF",
  CLP: "CLP",
  CNY: "CNY",
  CZK: "CZK",
  DKK: "DKK",
  EUR: "EUR",
  GBP: "GBP",
  HKD: "HKD",
  HUF: "HUF",
  IDR: "IDR",
  ILS: "ILS",
  INR: "INR",
  JPY: "JPY",
  KRW: "KRW",
  MXN: "MXN",
  MYR: "MYR",
  NOK: "NOK",
  NZD: "NZD",
  PHP: "PHP",
  PKR: "PKR",
  PLN: "PLN",
  RUB: "RUB",
  SEK: "SEK",
  SGD: "SGD",
  THB: "THB",
  TRY: "TRY",
  TWD: "TWD",
  ZAR: "ZAR"
}

export const initialState = {
  user: {
    loaded: false,
    userType: userType.UNKNOWN,
    address: "0x0000000000000000000000000000000000000000",
    isVerified: false,
  },
  price: {
    ether: {
      last_updated: -1,
      displayCurrency: currency.USD,
      price: null,
      price_btc: null,
      errorMessage: ''
    },
    tokens: {
      user: {
        loaded: false,
        displayBalance: null,
        balanceWeiBN: null
      },
      fund: {
        blockNum: -1,
        txHash: null,
        numerator: null,
        denominator: null,
      }
    }
  }
}
