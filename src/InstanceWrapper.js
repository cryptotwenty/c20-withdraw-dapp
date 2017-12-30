import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import getC20Instance from './utils/getC20Instance'
import { connect } from 'react-redux'
// import { } from './actions'

class InstanceWrapper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      instanceLoaded: false,
      accounts: null,
      web3: null,
      c20Instance: null,
    }
  }

  componentDidMount() {
    getC20Instance().then(result =>{
      this.setState((prevState, props) => (
        {
          ...this.state,
          instanceLoaded: true,
          accounts: result.accounts,
          web3: result.web3,
          c20Instance: result.c20Instance,
        })
      )

      // set up listeners on the contract.
      result.c20Instance.PriceUpdate(
        {}, { fromBlock: 0, toBlock: 'latest' }
      ).watch ( (err, response) => {
        console.log('EVENT LOG(LogTollBoothOperatorCreated):', response)
        console.log('EVENT LOG(LogTollBoothOperatorCreated):', response.args)

        const {
          numerator,
          denominator,
        } = response.args

        // this.props.dispatch(priceUpdate(
        //   numerator,
        //   denominator,
        // ))
      })
    })
  }

  getChildContext() {
    return this.state
  }

  render() {
    const { children } = this.props
    return (children && this.state.instanceLoaded) ? React.Children.only(children) :
    <div>
    <h1>Connecting to Ethereum</h1>
    <h2>Please be patient</h2>
    </div>
  }
}

InstanceWrapper.childContextTypes = {
  instanceLoaded: PropTypes.bool,
  accounts: PropTypes.array,
  web3: PropTypes.object,
  c20Instance: PropTypes.object,
}

export default connect()(InstanceWrapper)
