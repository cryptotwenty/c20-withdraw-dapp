import React, { Component } from 'react';

const TopBar = () =>
  <div className="row">
    <div className="col-xs-4">
      <h4 className="name">CRYPTO20</h4>
      <img alt="C20 Icon" className="c20-icon" src="https://static.crypto20.com/images/icons/c20-alt-2-darkblue.png" />
    </div>
    <div className="col-xs-8 text-right">
      <div className="updated">updated 5 minutes ago..</div>
      <div className="price-big crypto20">$19.857</div>
      <div className="crypto20"><img alt="C20 Icon" className="ccc" src="https://static.crypto20.com/images/icons/c20-alt-2-darkblue.png" />82,245,015 <small>IN CIRCULATION</small></div>
      <div className="crypto20">$1,593,345,017.84 <small>MARKET CAP</small></div>
    </div>
  </div>

const PriceUpdateStatus = () =>
  <div className="row">
    <div className="col-xs-12">
      <h6>NEXT C20 PRICE UPDATE: <small>(UPDATED HOURLY)</small></h6>
      <div className="progress" style={{backgroundColor: '#f5f5f5', margin: '10px 0'}}>
        <div className="progress-bar" data-original-title="55 Minutes Till Next C20 Price Update" data-placement="top" data-toggle="tooltip" role="progressbar" style={{width: '91.66666%', backgroundColor: '#003049'}} title>55 Mins</div>
      </div>
    </div>
  </div>

const Body = () =>
  <div className="row">
    <div className="row">
      <div className="col-sm-12">
        <h4>Withdraw ETH for C20:</h4>
        <h6>Choose your connected ETH address</h6>
        <select className="form-control" id="ethAddress" style={{height: 48}}>
          <option>0x0000000000000000000000000000000000000000</option>
          <option>0x0000000000000000000000000000000000000000</option>
          <option>0x0000000000000000000000000000000000000000</option>
        </select>
      </div>
    </div>
    <div className="row">
      <div className="col-xxs-6 col-xxs-push-3 col-xs-4 col-xs-push-0">
        <img alt="C20 Icon" className="img-responsive" src="https://static.crypto20.com/images/logos/metamask.png" />
      </div>
      <div className="col-xxs-12 col-xs-8">
        <div className="table-responsive">
          <table className="table table-bordered table-invested">
            <tbody>
            <tr>
            <th colSpan={2}>Totals:</th>
            </tr><tr><td>C20 Total:</td><td>
            <img alt="C20 Icon" className="ccc" src="https://static.crypto20.com/images/icons/c20-alt-2-darkblue.png" />3489</td></tr><tr>
            <td>Equivalent ETH:</td><td><i className="cc ETH" /> 227.79681</td>
            </tr><tr><td>Equivalent USD:</td>
            <td><i className="fa fa-dollar" /> 68,339.043</td>
            </tr></tbody></table>
            </div>
            </div>
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
                <TopBar/>
                <PriceUpdateStatus/>
                <Body/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

export default App;
