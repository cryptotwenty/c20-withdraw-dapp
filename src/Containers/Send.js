import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withFormik } from 'formik'
import Yup from 'yup'
import { transferTokens } from '../actions'
import { txState } from '../reducers/initialState'
import BigNumber from 'bignumber.js'
import './toggle.css'
import Loading from '../components/Loading'
var ethereum_address = require('ethereum-address');

// TODO:: Put into a constants file:
const pow18 = new BigNumber('1000000000000000000')

// Our inner form component. Will be wrapped with Formik({..})
const MyInnerForm = props => {
  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
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
    (tokenAmount / fund.tokensPerEther).toFixed(2)
    : <Loading size={'10px'}/>
  const fiatValue = (user.loaded && fund.blockNum > 0 && ether.last_updated > 0) ? (ethValue * ether.price).toFixed(2) : <Loading size={'10px'}/>


  return (
    <form onSubmit={handleSubmit}>
      <table className="table table-bordered table-invested">
        <tbody>
          <tr>
            <td colSpan={3} style={{whiteSpace: 'normal'}}>Please supply the ammount of tokens you wish to send and the destination Ethereum address bellow.</td>
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
                    if (e.target.value == '') {e.target.value = 0} // prevent field from being empty
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
                  <input
                    className="input-c20 form-control"
                    id="toAddress"
                    style={{marginBottom: 10, width: '100%'}}
                    type="text"
                    value={values.toAddress}
                    onChange={handleChange} />
                  {errors.toAddress &&
                    touched.toAddress &&
                    <div className="ui-state-error">{errors.toAddress}</div>}
              <button
                className={errors.tokenAmount /*&& touched.tokenAmount*/ || (errors.toAddress &&
                  touched.toAddress) ? "btn btn-withdraw ui-state-error disabled" : "btn btn-withdraw btn-primary"}
                id="withdrawC20"
                style={{backgroundColor: 'red'}}
                type="submit">
                <i className="fa fa-send" />Send Tokens
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
  mapPropsToValues: ({tokenAmount}) => {
    return ({
      tokenAmount: tokenAmount,
      toAddress: ''
    })
  },
  validationSchema: ({minWithdraw, maxWithdraw}) => Yup.object().shape({
    tokenAmount: Yup.number('should not leave this blank')
      .positive('Should be positive')
      .min(minWithdraw, 'You cannot withdraw less than ' + minWithdraw + '.')
      .max(maxWithdraw, 'You cannot withdraw more than ' + maxWithdraw + ' tokens which is your full balance.')
      .required('You must specify a withdraw amount.'),
    toAddress: Yup.string()
      .test('is-address', '${path} is not a valid checksum address. We only allow checksum addresses for your safety.', value => ethereum_address.isAddress(value))
  }),
  handleSubmit: (values, {setSubmitting, props}) => {
      props.withdrawFunc(values)
      setSubmitting(false)
  },
  displayName: 'BasicForm', // helps with React DevTools
})(MyInnerForm);

class Send extends Component {
  render() {
    const withdrawFunc = (arg) => {
      let sendAmount = pow18.mul(arg.tokenAmount)
      if (arg.fullAmount) {
        sendAmount = this.props.price.tokens.user.balanceWeiBN
      }
      this.props.dispatch(transferTokens(this.context.c20Instance, this.context.web3, this.context.accounts, arg.toAddress, sendAmount))
    }

    const formProps = {
      minWithdraw: 0,
      maxWithdraw: this.props.price.tokens.user.displayBalance,
      user: this.props.user,
      price: this.props.price,
    }

    // TODO:: ui: keep the background the submit screen and put text over it as an overlay.
    switch(this.props.transferTx.state){
      case txState.NONE:
        return (
          <div className="col-sm-12">
            <h6 style={{marginTop: 0}}>CHOOSE C20 WITHDRAWAL AMOUNT:</h6>
            <div className="table-responsive">
              <EnhancedForm tokenAmount={0} {...formProps} withdrawFunc={withdrawFunc}/>
            </div>
          </div>
        )
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
            <h6>View transaction on <a href={'https://etherscan.io/tx/' + this.props.transferTx.txHash} target="_blank">etherscan.io:</a></h6>
          </div>
        )
      case txState.COMPLETE:
        // TODO:: Add timer
        return (
          <div className="col-sm-12">
            <h6>Transaction has been Mined.</h6>
            <h6>Wait for next price update to withdraw your ether.</h6>
            <h6>View transaction on <a href={'https://etherscan.io/tx/' + this.props.transferTx.txHash} target="_blank">etherscan.io:</a></h6>
          </div>
        )
      default:
        return null
    }
  }
}

Send.contextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  c20Instance: PropTypes.object,
}

const mapStateToProps = state => ({
  user: state.user,
  price: state.price,
  updateTicker: state.updateTicker,
  transferTx: state.transactions.transfer,
})

export default connect(mapStateToProps)(Send)
