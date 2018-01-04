import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withFormik } from 'formik'
import Yup from 'yup'
import './toggle.css'

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
    : 'loading (TODO:: ADD LOAD SPINNER)'
  const fiatValue = (user.loaded && fund.blockNum > 0 && ether.last_updated > 0) ? (ethValue * ether.price).toFixed(2) : 'loading (TODO:: ADD LOAD SPINNER)'

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
      let amountToRequest = arg.tokenAmount
      if (arg.fullAmount) {
        amountToRequest = this.props.price.tokens.user.balanceWeiBN
      }
      // this.props.dispatch()
    }

    const formProps = {
      minWithdraw: 0,
      maxWithdraw: this.props.price.tokens.user.displayBalance,
      user: this.props.user,
      price: this.props.price,
    }
    const special = thingToPrint => console.log(thingToPrint)
    return (
      <div className="col-sm-12">
        <h6 style={{marginTop: 0}}>CHOOSE C20 WITHDRAWAL AMOUNT:</h6>
        <div className="table-responsive">
            <EnhancedForm tokenAmount={10} {...formProps} withdrawFunc={withdrawFunc}/>
        </div>
      </div>
    )
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
})

export default connect(mapStateToProps)(RequestWithdraw)
