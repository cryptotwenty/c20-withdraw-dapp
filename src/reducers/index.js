import {
  actions
} from '../actions'
import {
  initialState,
  userType,
} from './initialState'

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // TODO:: use sub-reducers
    case actions.SAVE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          loaded: true,
          address: action.userAddress
        }
      }
    case actions.SAVE_USER_BALANCE:
      let displayBalance = action.precisionBalance.div('1000000000000000000').toNumber()
      return {
        ...state,
        price: {
          ...state.price,
          tokens: {
            ...state.price.tokens,
            user: {
              ...state.price.tokens.user,
              loaded: true,
              displayBalance,
              balanceWeiBN: action.precisionBalance,
            }
          }
        }
      }
    case actions.SAVE_ETHER_PRICE:
      const {
        wasError,
        price,
        price_btc,
        last_updated,
      } = action
      if (wasError) return {
        errorMessage: 'Error: the coinmarketcap.com service is unavailable.'
      }

      return {
        ...state,
        price: {
          ...state.price,
          ether: {
            ...state.price.ether,
            price,
            price_btc,
            last_updated,
            errorMessage: "",
          }
        }
      }
    case actions.UPDATE_PRICE:
      if (action.blockNum < state.price.blockNum)
        return state

      const tokensPerEther = action.numerator.div(action.denominator).toNumber()

      return {
        ...state,
        price: {
          ...state.price,
          tokens: {
            ...state.price.tokens,
            fund: {
              ...state.price.tokens.fund,
              numerator: action.numerator,
              denominator: action.denominator,
              tokensPerEther,
              txHash: action.txHash,
              blockNum: action.blockNum,
            }
          }
        }
      }
    default:
      return state
  }
}

export default reducer
