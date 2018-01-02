export const actions = {
  UPDATE_PRICE: 'UPDATE_PRICE',
  SAVE_USER: 'SAVE_USER'
}

export const priceUpdate = (numerator, denominator, txHash, blockNum) => {
  return {
    type: actions.UPDATE_PRICE,
    numerator,
    denominator,
    txHash,
    blockNum,
  }
}

export const loadUser = (c20Instance, web3, accounts) => {
  return dispatch => {
    let account
    if (accounts[0] == null)
      account = '0x0000000000000000000000000000000000000000'
    else
      account = accounts[0]

    dispatch({
      type: actions.SAVE_USER,
      userAddress: account
    })

    // web3.eth.getBalance(account, (error /*TODO::ignoring errors for now*/, etherBalance) =>
    //   dispatch ({
    //     type: actions.SAVE_USER_BALANCE,
    //     etherBalance
    //   })
    // )
    //
    // // Try determine the user type.
    // regulatorInstance.getOwner().then((regulatorAddress) =>
    //   dispatch ({
    //     type: actions.SAVE_REGULATOR,
    //     regulatorAddress
    //   })
    // )
    //
    // regulatorInstance.getVehicleType(account).then((vehicleType) =>
    //   dispatch ({
    //     type: actions.SAVE_VEHICLE_TYPE,
    //     vehicleType
    //   })
    // )
  }
}
