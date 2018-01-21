import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withFormik } from 'formik'
import { executeWithdraw } from '../actions'
import { txState, userType } from '../reducers/initialState'
import BigNumber from 'bignumber.js'
import Loading from '../components/Loading'
import './toggle.css'

// TODO:: Put into a constants file:
const pow18 = new BigNumber('1000000000000000000')

// Our inner form component. Will be wrapped with Formik({..})
const MyInnerForm = props => {
  const {
    errors,
    handleSubmit,
    user,
    price: {
      tokens: {
        fund
      },
      ether,
    }
  } = props

  const withdrawAmount = user.withdrawalData.tokens.div(pow18).toNumber()
  const tokenDisplayAmount = withdrawAmount
  const ethValue = user.withdrawalData.actualizedWithdrawPrice.numerator !== -1 ?
    (withdrawAmount / user.withdrawalData.actualizedWithdrawPrice.tokensPerEther).toFixed(5)
    : <Loading size={'10px'}/>
  const fiatValue = (user.loaded && fund.blockNum > 0 && ether.last_updated > 0) ? (ethValue * ether.price).toFixed(2) : <Loading size={'10px'}/>

  return (
    <form onSubmit={handleSubmit}>
      <table className="table table-bordered table-invested">
        <tbody>
          <tr>
            <td colSpan={3} style={{whiteSpace: 'normal'}}>For {tokenDisplayAmount} C20, you will receive {ethValue} ETH. This Ether belongs to you, and you can withdraw it at any time.</td>
          </tr>
          <tr>
            <td colSpan={3}>
              <button
                className={errors.withdrawAmount /*&& touched.withdrawAmount*/ ? "btn btn-withdraw ui-state-error disabled" : "btn btn-withdraw btn-primary"}
                id="withdrawC20"
                style={{backgroundColor: 'red'}}
                type="submit">
                <i className="fa fa-send" /> Execute Withdraw of {ethValue} ETH
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <img alt="C20 Icon" className="ccc" src="https://static.crypto20.com/images/icons/c20-alt-2-darkblue.png" />
              {tokenDisplayAmount}
            </td>
            <td>
              <i className="cc ETH" /> {ethValue}</td><td><i className="fa fa-dollar" /> {fiatValue}
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  )
}

const EnhancedForm = withFormik({
  mapPropsToValues: ({withdrawAmount}) => {
    return ({
      withdrawAmount: withdrawAmount,
    })
  },
  handleSubmit: (values, {setSubmitting, props}) => {
      props.withdrawFunc(values)
      setSubmitting(false)
  },
  displayName: 'BasicForm', // helps with React DevTools
})(MyInnerForm);

class Withdraw extends Component {
  render() {
    const withdrawFunc = (arg) => {
      this.props.dispatch(executeWithdraw(this.context.c20Instance, this.context.web3, this.context.accounts))
    }

    const formProps = {
      minWithdraw: 0,
      maxWithdraw: this.props.price.tokens.user.displayBalance,
      user: this.props.user,
      price: this.props.price,
    }

    // TODO:: ui: keep the background the submit screen and put text over it as an overlay.
    switch(this.props.withdrawalTx.state){
      case txState.NONE:
        if(this.props.user.userType === userType.WITHDRAW_ETH){
          return (
            <div className="col-sm-12">
              <h6 style={{marginTop: 0}}>EXECUTE WITHDRAWAL TO ETH:</h6>
              <div className="table-responsive">
                <EnhancedForm {...formProps} withdrawFunc={withdrawFunc}/>
              </div>
            </div>
          )
        } else {
          return <div className="col-sm-12">
            <h6 style={{marginTop: 0}}>EXECUTE WITHDRAWAL TO ETH:</h6>
            <div className="table-responsive">
              <table className="table table-bordered table-invested">
                <tbody>
                  <tr>
                    <td colSpan={3} style={{whiteSpace: 'normal'}}>The amount of ether you will be able to withdraw will be calculated on the next price update after completing steps 1 and 2 above.</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <button className={"btn btn-withdraw btn-primary"}>
                        <i className="fa fa-send" />Steps 1 and 2 need to be completed to access this functionality.
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img alt="C20 Icon" className="ccc" src="https://static.crypto20.com/images/icons/c20-alt-2-darkblue.png" />
                    </td>
                    <td>
                      <i className="cc ETH" /></td><td><i className="fa fa-dollar" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        }
      case txState.INIT:
        // TODO:: add message and button about reloading if user rejects in metamask
        return (
          <div className="col-sm-12">
            <h6>Creating transaction and sending to the Ethereum Network.</h6>
          </div>
        )
      case txState.SUBMIT:
        return (
          <div className="col-sm-12">
            <h6>Waiting for transaction to be mined by the Ethereum Network.</h6>
            <h6>View transaction on <a href={'https://etherscan.io/tx/' + this.props.withdrawalTx.txHash} target="_blank">etherscan.io:</a></h6>
          </div>
        )
      case txState.COMPLETE:
        // TODO:: Add timer
        return (
          <div className="col-sm-12">
            <h6>Transaction has been Mined.</h6>
            <h6>Your balance should be updated.</h6>
            <h6>View transaction on <a href={'https://etherscan.io/tx/' + this.props.withdrawalTx.txHash} target="_blank">etherscan.io:</a></h6>
          </div>
        )
      default:
        return null
    }
  }
}

Withdraw.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  c20Instance: PropTypes.object,
}

const mapStateToProps = state => ({
  user: state.user,
  price: state.price,
  updateTicker: state.updateTicker,
  withdrawalTx: state.transactions.withdrawal,
})

export default connect(mapStateToProps)(Withdraw)
