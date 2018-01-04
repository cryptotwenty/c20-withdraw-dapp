import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

class Withdraw extends Component {
  render() {
    return (
      <div className="col-sm-12">
        <h6 style={{marginTop: 0}}>CHOOSE C20 WITHDRAWAL AMOUNT:</h6>
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
              <tr>
                <td>
                  <img alt="C20 Icon" className="ccc" src="https://static.crypto20.com/images/icons/c20-alt-2-darkblue.png" />
                  200
                </td>
                <td>
                  <i className="cc ETH" /> 12.826</td><td><i className="fa fa-dollar" /> 3,846
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
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
})

export default connect(mapStateToProps)(Withdraw)
