import React, { Component } from 'react'
import Loading from './Loading'

const PriceTable = ({price}) => {
  const {
    tokens: {
      user,
      fund
    },
    ether
  } = price

  // TODO:: put these calculations into redux rather
  let c20Balance = user.loaded ? user.displayBalance : <Loading size={'10px'}/>
  let ethValue = user.loaded ? (
      fund.blockNum > 0 ? user.displayBalance / fund.tokensPerEther : <Loading size={'10px'}/>
    ) : <Loading size={'18px'}/>
  let fiatValue = (user.loaded && fund.blockNum > 0 && ether.last_updated > 0) ? ethValue * ether.price : <Loading size={'10px'}/>

  // TODO:: display message if error with coinmarketcap.com api
  return (
    <div className="col-xxs-12 col-xs-8">
      <div className="table-responsive">
        <table className="table table-bordered table-invested">
          <tbody>
            <tr>
              <th colSpan={2}>Totals:</th>
            </tr>
            <tr>
              <td>C20 Total:</td>
              <td style={{display: 'flex', flexDirection: 'row'}}>
                <img alt="C20 Icon" className="ccc" src="https://static.crypto20.com/images/icons/c20-alt-2-darkblue.png" />
                  {c20Balance}
              </td>
            </tr>
            <tr>
              <td>Equivalent ETH:</td>
              <td style={{display: 'flex', flexDirection: 'row'}}><i className="cc ETH" />{ethValue}</td>
            </tr>
            <tr>
              <td>Equivalent USD:</td>
              <td style={{display: 'flex', flexDirection: 'row'}}><i className="fa fa-dollar" />{fiatValue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default PriceTable
