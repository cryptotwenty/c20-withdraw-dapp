import React, { Component } from 'react'
import jazzicon from 'jazzicon'

export default class Identicon extends Component {
  constructor(props) {
    super(props);
    this.state = {hasLoaded: false};
  }

  loadIdenticon() {
    const {
      address,
      diameter
    } = this.props
    if (address !== '0x0000000000000000000000000000000000000000' && !this.state.hasLoaded) {
      const addresToInt = parseInt(
        address.slice(2, 10),
        16
      )
      this.refs['identicon-' + address].append(jazzicon(diameter, addresToInt))
      this.setState({hasLoaded: true})
    }
  }
  componentDidMount() {
    this.loadIdenticon()
  }

  componentDidUpdate() {
    this.loadIdenticon()
  }
  render() {
    return(
      <div ref={'identicon-' + this.props.address}/>
    )
  }
}
