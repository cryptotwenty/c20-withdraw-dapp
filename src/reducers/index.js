import {
  actions
} from '../actions'
import {
  initialState,
  userType,
} from './initialState'
import BigNumber from 'bignumber.js'

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
        user: {
          ...state.user,
          balance: {
            ...state.user.balance,
            tokens: {
              loaded: true,
              displayBalance,
              balanceWeiBN: action.precisionBalance,
            }
          }
        }
      }
    case actions.UPDATE_PRICE:
      if (action.blockNum < state.price.blockNum)
        return state

      return {
        ...state,
        price: {
          numerator: action.numerator,
          denominator: action.denominator,
          txHash: action.txHash,
          blockNum: action.blockNum,
        }
      }
    default:
      return state
  }
}

export default reducer
