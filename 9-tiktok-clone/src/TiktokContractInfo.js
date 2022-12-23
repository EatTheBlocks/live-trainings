import { useState } from 'react'

import { useBalance } from 'wagmi'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

function TiktokContractInfo(props) {
  const [contractBalance, setContractBalance] = useState(0)

  // Get the current balance of the Tiktok smart contract wallet
  useBalance({
    address: props.tiktokContract.address,
    formatUnits: 'ether',
    watch: true,
    onSuccess(data) {
      setContractBalance(data.formatted)
    },
    onError(error) {
      console.log(
        'Error while fetching balance of Tiktok Smart Contract: ',
        error
      )
    },
  })

  return (
    <>
      <Row>
        <h3 className='text-5xl font-bold mb-20'>{'Tiktok Contract Info'}</h3>
      </Row>
      <Row>
        <Col md='auto'>Tiktok Contract Address:</Col>
        <Col>{props.tiktokContract.address}</Col>
      </Row>
      <Row>
        <Col md='auto'>Balance:</Col>
        <Col>{contractBalance} ETH</Col>
      </Row>
    </>
  )
}

export default TiktokContractInfo
