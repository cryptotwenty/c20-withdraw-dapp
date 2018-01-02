import React, { Component } from 'react'
import jazzicon from 'jazzicon'

export default class Identicon extends Component {
  componentDidMount() {
    const addresToInt = parseInt(
      this.props.address.slice(2, 10),
      16
    )
    this.refs['identicon-'+this.props.address].append(jazzicon(this.props.diameter, addresToInt))
  }
  render() {
    return(
      <div ref={'identicon-' + this.props.address}/>
    )
  }
}
