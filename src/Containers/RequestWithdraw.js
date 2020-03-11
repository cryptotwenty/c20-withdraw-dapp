import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withFormik } from 'formik'
import Yup from 'yup'
import { requestWithdraw } from '../actions'
import { txState } from '../reducers/initialState'

import Loading from '../components/Loading'
import './toggle.css'

// TODO:: Put into a constants file:
const BigNumber = require('bignumber.js')
const pow18 = new BigNumber('1000000000000000000')

// Our inner form component. Will be wrapped with Formik({..})
const MyInnerForm = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    user,
    maxWithdraw,
    price: {
      tokens: {
        fund
      },
      ether,
    }
  } = props

  const tokenAmount = values.fullAmount ? maxWithdraw : values.tokenAmount
  const tokenDisplayAmount = tokenAmount.toFixed(2)
  const ethValue = fund.blockNum > 0 ?
    (tokenAmount / fund.tokensPerEther).toFixed(5)
    : <Loading size={'10px'}/>
  const fiatValue = (user.loaded && fund.blockNum > 0 && ether.last_updated > 0) ? (ethValue * ether.price).toFixed(2) : <Loading size={'10px'}/>

  return (
    <form onSubmit={handleSubmit}>
      <table className="table table-bordered table-invested">
        <tbody>
          <tr>
            <td colSpan={3} style={{whiteSpace: 'normal'}}>For {tokenDisplayAmount} C20, you will receive {ethValue} ETH. Click withdraw to confirm.</td>
          </tr>
          <tr>
            <td colSpan={3}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <input
                  className="input-c20 form-control"
                  id="tokenAmount"
                  style={{marginBottom: 10, width: '100%'}}
                  type="number"
                  value={tokenAmount}
                  disabled={values.fullAmount}
                  onChange={e => {
                    if (e.target.value === '') {e.target.value = 0} // prevent field from being empty
                    handleChange(e)
                  }} />
                  <div>
                    <h5 style={{marginLeft: '10px', marginBottom: 0, marginTop: 0, width: '100px'}}>
                      Full Balance
                    </h5>
                    <label style={{marginLeft: '10px'}} className="switch">
                      <input
                        onChange={handleChange}
                        id="fullAmount"
                        type="checkbox"/>
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                  {errors.tokenAmount &&
                  /*touched.tokenAmount &&*/
                  <div className="ui-state-error">{errors.tokenAmount}</div>}
              <button
                className={errors.tokenAmount /*&& touched.tokenAmount*/ ? "btn btn-withdraw ui-state-error disabled" : "btn btn-withdraw btn-primary"}
                id="withdrawC20"
                style={{backgroundColor: 'red'}}
                type="submit">
                <i className="fa fa-send" />Request Withdraw
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <img alt="C20 Icon" className="ccc" src="https://cdn.crypto20.com/images/icons/c20-alt-2-darkblue.png" />
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
  mapPropsToValues: ({tokenAmount}) => {
    return ({
      tokenAmount: tokenAmount,
    })
  },
  validationSchema: ({minWithdraw, maxWithdraw}) => Yup.object().shape({
    tokenAmount: Yup.number('should not leave this blank')
      .positive('Should be positive')
      .min(minWithdraw, 'You cannot withdraw less than ' + minWithdraw + '.')
      .max(maxWithdraw, 'You cannot withdraw more than ' + maxWithdraw + ' tokens which is your full balance.')
      .required('You must specify a withdraw amount.'),
  }),
  handleSubmit: (values, {setSubmitting, props}) => {
      props.withdrawFunc(values)
      setSubmitting(false)
  },
  displayName: 'BasicForm', // helps with React DevTools
})(MyInnerForm);

class RequestWithdraw extends Component {
  render() {
    const withdrawFunc = (arg) => {
      let amountToRequest = pow18.mul(arg.tokenAmount)
      if (arg.fullAmount) {
        amountToRequest = this.props.price.tokens.user.balanceWeiBN
      }
      this.props.dispatch(requestWithdraw(this.context.c20Instance, this.context.web3, this.context.accounts, amountToRequest))
    }

    const formProps = {
      minWithdraw: 0,
      maxWithdraw: this.props.price.tokens.user.displayBalance,
      user: this.props.user,
      price: this.props.price,
    }

    const {
      requestTx: {
        state,
        message,
        txHash,
        transactionSuccess,
      },
      isDisabled,
    } = this.props

    const disabledClass = isDisabled ? ' is-disabled' : ''
    // TODO:: ui: keep the background the submit screen and put text over it as an overlay.
    switch(state){
      case txState.NONE:
        return (
          <div className={"col-sm-12" + disabledClass}>
            {(message !== '') && <div className="ui-state-error">{message}</div>}
            <h6 style={{marginTop: 0}}>CHOOSE C20 WITHDRAWAL AMOUNT:</h6>
            <div className="table-responsive">
              <EnhancedForm tokenAmount={0} {...formProps} withdrawFunc={withdrawFunc}/>
            </div>
          </div>
        )
      case txState.INIT:
        // TODO:: add message and button about reloading if user rejects in metamask
        return (
          <div className={"col-sm-12" + disabledClass}>
            <h6>Creating transaction and sending to the Ethereum Network.</h6>
          </div>
        )
      case txState.SUBMIT:
        return (
          <div className={"col-sm-12" + disabledClass}>
            <h6>Waiting for transaction to be mined by the Ethereum Network.</h6>
            <h6>View transaction on <a href={'https://etherscan.io/tx/' + txHash} target="_blank">etherscan.io:</a></h6>
          </div>
        )
      case txState.COMPLETE:
        // TODO:: Add timer
        return (
          <div className="col-sm-12">
            {transactionSuccess?
              <div className={disabledClass}>
                <h6>Transaction has been Mined.</h6>
                <h6>Wait for next price update to withdraw your ether.</h6>
              </div>
            :
              <div className="ui-state-error">
                <h6>Transaction has been Mined. However, it was unsuccessful.</h6>
                <h6>Please try again or contact Crypto20 support.</h6>
              </div>
            }
            <h6>View transaction on <a href={'https://etherscan.io/tx/' + txHash} target="_blank">etherscan.io:</a></h6>
          </div>
        )
      default:
        return null
    }
  }
}

RequestWithdraw.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  c20Instance: PropTypes.object,
}

const mapStateToProps = state => ({
  user: state.user,
  price: state.price,
  updateTicker: state.updateTicker,
  requestTx: state.transactions.request,
})

export default connect(mapStateToProps)(RequestWithdraw)
