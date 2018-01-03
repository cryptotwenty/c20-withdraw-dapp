import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Identicon from './components/Identicon'
import PriceTable from './components/PriceTable'

const TopBar = ({price}) =>{
  const {
    tokens: {
      fund
    },
    ether
  } = price

  // TODO:: get this from their api
  const totalSupply = 40630596.65
  const marketCap = (totalSupply / fund.tokensPerEther) * ether.price
  const updatedTime = Math.floor(((new Date().getTime()/1000) - ether.last_updated)/60)

  return (
    <div className="row">
      <div className="col-xs-4">
        <h4 className="name">CRYPTO20</h4>
        <img alt="C20 Icon" className="c20-icon" src="https://static.crypto20.com/images/icons/c20-alt-2-darkblue.png" />
      </div>
      <div className="col-xs-8 text-right">
        <div className="updated">updated {updatedTime} minutes ago..</div>
        <div className="price-big crypto20"></div>
        <div className="crypto20"><img alt="C20 Icon" className="ccc" src="https://static.crypto20.com/images/icons/c20-alt-2-darkblue.png" />{totalSupply}<small>IN CIRCULATION</small></div>
        <div className="crypto20">${marketCap}<small>MARKET CAP</small></div>
      </div>
    </div>
  )
}

const PriceUpdateStatus = ({updateTicker}) =>
  <div className="row">
    <div className="col-xs-12">
      <h6>NEXT C20 PRICE UPDATE: <small>(UPDATED HOURLY)</small></h6>
      <div className="progress" style={{backgroundColor: '#f5f5f5', margin: '10px 0'}}>
        {updateTicker.minute == 60 ?
          <div className="progress-bar" data-original-title="Pending update, waiting for confirmation from Ethereum." data-placement="top" data-toggle="tooltip" role="progressbar" style={{width: '100%', backgroundColor: '#003049'}}>Pending update, waiting for confirmation from Ethereum.</div>
          : <div className="progress-bar" data-original-title={updateTicker.minute + "Minutes Till Next C20 Price Update"} data-placement="top" data-toggle="tooltip" role="progressbar" style={{width: 100*Math.max(0, updateTicker.minute)/60  + '%', backgroundColor: '#003049'}}>
              {60 - updateTicker.minute} Mins left
            </div>
        }
      </div>
    </div>
  </div>

const Body = ({user, price}) =>
  <div className="row">
    <div className="row">
      <div className="col-sm-12">
        <h4>Your C20 Eth address:</h4>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <Identicon diameter={60} address={user.address} />
          <h5 style={{paddinLeft: '2em'}}>{user.address}</h5>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-xxs-6 col-xxs-push-3 col-xs-4 col-xs-push-0">
        <img alt="C20 Icon" className="img-responsive" src="https://static.crypto20.com/images/logos/metamask.png" />
      </div>
      <PriceTable price={price}/>
    </div>
    <div className="row"><div className="col-sm-12"><h6 style={{marginTop: 0}}>CHOOSE C20 WITHDRAWAL AMOUNT:</h6>
      <div className="table-responsive">
        <table className="table table-bordered table-invested">
          <tbody>
            <tr>
              <td colSpan={3} style={{whiteSpace: 'normal'}}>For 200 C20, you will receive 12.826 ETH. Click withdraw to confirm.</td>
            </tr>
            <tr>
            <td colSpan={3}>
            <input className="input-c20 form-control" id="tokenAmount" style={{marginBottom: 10, width: '100%'}} defaultValue={200} type="text" />
            <a className="btn btn-withdraw btn-primary" id="withdrawC20"><i className="fa fa-send" /> Withdraw</a>
            </td>
            </tr>
            <tr><td>
              <img alt="C20 Icon" className="ccc" src="https://static.crypto20.com/images/icons/c20-alt-2-darkblue.png" />200</td>
            <td><i className="cc ETH" /> 12.826</td><td><i className="fa fa-dollar" /> 3,846</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  </div>

class App extends Component {
  render() {
    return (
      <div className="col-xs-12 col-sm-12 col-lg-8 col-lg-push-2">
        <div className="panel">
        <div className="panel-footer">
          <div className="row">
            <div className="col-sm-12 col-md-12">
              <div className="row">
                <TopBar price={this.props.price}/>
                <PriceUpdateStatus updateTicker={this.props.updateTicker}/>
                <Body user={this.props.user} price={this.props.price}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

App.contextTypes = {
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

export default connect(mapStateToProps)(App)
