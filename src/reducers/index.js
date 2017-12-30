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
      return state
    default:
      return state
  }
}

export default reducer
