import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import getC20Instance from './utils/getC20Instance'
import { connect } from 'react-redux'
import { priceUpdate, loadUser } from './actions'

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

      /////
      // Load the users data:
      /////
      this.props.dispatch(loadUser(result.c20Instance, result.web3, result.accounts))

      /////
      // set up listeners on the contract.
      /////
      const latestBlock = result.web3.eth.getBlock('latest')
      // -800 blocks should be more than 2 hours ago, no need to go further in history.
      const startMonitorBlock = Math.max(0, latestBlock - 800)
      result.c20Instance.PriceUpdate(
        {}, { fromBlock: startMonitorBlock, toBlock: 'latest' }
      ).watch ( (err, response) => {
        const {
          transactionHash,
          blockNumber,
          args: {
            numerator,
            denominator,
          }
        } = response

        console.log('EVENT LOG(PriceUpdate):', {
          numerator: numerator.toString(),
          denominator: denominator.toString(),
        })

        this.props.dispatch(priceUpdate(
          numerator,
          denominator,
          transactionHash,
          blockNumber,
        ))
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
