import {
  actions
} from '../actions'
import {
  initialState,
  userType,
  txState,
} from './initialState'

const reducer = (state = initialState, action) => {
  let tokensPerEther
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
    case actions.LOAD_USERS_WHITELIST:
      return {
        ...state,
        user: {
          ...state.user,
          isWhitelisted: action.isWhitelisted,
          isWhitelistLoaded: true,
        }
      }
    case actions.LOAD_USERS_WITHDRAWAL:
      const hasFetchedLastUpdateTime = state.price.tokens.fund.lastUpdateTime > 0
      const newUserType = (action.hasWithdrawal ?
        (((action.withdrawal[1].lt(state.price.tokens.fund.lastUpdateTime)
          && hasFetchedLastUpdateTime)
        ) ?
          userType.WITHDRAW_ETH
          : userType.WATING_FOR_PRICE_UPDATE
        )
        : userType.REQUEST_WITHDRAW)
      return {
        ...state,
        user: {
          ...state.user,
          userType: newUserType,
          withdrawalData: {
            ...state.user.withdrawalData,
            tokens: action.withdrawal[0],
            time: action.withdrawal[1]
          }
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

      tokensPerEther = action.numerator.div(action.denominator).toNumber()

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
              lastUpdateTime: action.lastUpdateTime,
            }
          }
        },
        updateTicker: {
          ...state.updateTicker,
        }
      }
    case actions.SET_WITHDRAWAL_PRICE:
      tokensPerEther = action.actualizedWithdrawPrice[0].div(action.actualizedWithdrawPrice[1]).toNumber()

      return {
        ...state,
        user: {
          ...state.user,
          withdrawalData: {
            ...state.user.withdrawalData,
            actualizedWithdrawPrice: {
              numerator: action.actualizedWithdrawPrice[0],
              denominator: action.actualizedWithdrawPrice[1],
              tokensPerEther
            },
          }
        }
      }
    case actions.UPDATE_MINUTE:
      const inSync = (state.updateTicker.minute%60) === action.minute
      const increment = inSync ? 0 : 1
      let minute
      if (action.wasUpdate){
        if (action.minute > 57) {
          minute = action.minute - 60
        } else {
          minute = action.minute
        }
      } else {
        minute = Math.min(60, state.updateTicker.minute + increment)
      }

      if (((minute+60)%60) !== action.minute && minute !== 60) // this means it is comletely out of sync (ie when it starts up)
        minute = action.minute

      return {
        ...state,
        updateTicker: {
          ...state.updateTicker,
          minute,
        }
      }
    case actions.INIT_REQUEST:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          request: {
            ...state.transactions.request,
            state: txState.INIT,
          }
        }
      }
    case actions.SUBMIT_REQUEST:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          request: {
            ...state.transactions.request,
            state: txState.SUBMIT,
            txHash: action.tx
          }
        }
      }
    case actions.COMPLETE_REQUEST:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          request: {
            ...state.transactions.request,
            message: '',
            state: txState.COMPLETE,
            transactionSuccess: action.transactionSuccess,
          }
        }
      }
    case actions.RESET_REQUEST:
      const curState = state.transactions.request.state
      const newTxState = (curState === txState.INIT) ? txState.NONE : (curState === txState.SUBMIT) ? txState.COMPLETE : txState.NONE
      return {
        ...state,
        transactions: {
          ...state.transactions,
          request: {
            ...state.transactions.request,
            state: newTxState,
            message: action.message
          }
        }
      }
    case actions.INIT_WITHDRAWAL:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          withdrawal: {
            ...state.transactions.withdrawal,
            state: txState.INIT,
          }
        }
      }
    case actions.SUBMIT_WITHDRAWAL:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          withdrawal: {
            ...state.transactions.withdrawal,
            state: txState.SUBMIT,
            txHash: action.tx
          }
        }
      }
    case actions.COMPLETE_WITHDRAWAL:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          withdrawal: {
            ...state.transactions.withdrawal,
            message: '',
            state: txState.COMPLETE,
          }
        }
      }
    case actions.RESET_WITHDRAWAL:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          withdrawal: {
            ...state.transactions.withdrawal,
            state: txState.NONE,
            message: action.message
          }
        }
      }
      // SEND is deprecated.
    // case actions.INIT_SEND:
    //   return {
    //     ...state,
    //     transactions: {
    //       ...state.transactions,
    //       transfer: {
    //         ...state.transactions.transfer,
    //         state: txState.INIT,
    //       }
    //     }
    //   }
    // case actions.SUBMIT_SEND:
    //   return {
    //     ...state,
    //     transactions: {
    //       ...state.transactions,
    //       transfer: {
    //         ...state.transactions.transfer,
    //         state: txState.SUBMIT,
    //         txHash: action.tx
    //       }
    //     }
    //   }
    // case actions.COMPLETE_SEND:
    //   return {
    //     ...state,
    //     transactions: {
    //       ...state.transactions,
    //       transfer: {
    //         ...state.transactions.transfer,
    //         message: '',
    //         state: txState.COMPLETE,
    //       }
    //     }
    //   }
    default:
      return state
  }
}

export default reducer
