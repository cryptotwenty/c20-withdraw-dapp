import {
  actions
} from '../actions'
import {
  initialState,
  userType,
} from './initialState'

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
