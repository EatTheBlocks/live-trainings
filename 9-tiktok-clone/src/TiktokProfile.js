import { useState } from 'react'

import { useAccount, useContract, useContractRead, useSigner } from 'wagmi'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import AddVideo from './profile/AddVideo'

function TiktokProfile(props) {
  const { address } = useAccount()

  // Tiktok Smart contract handling
  const [newTiktokChannelName, setNewTiktokChannelName] = useState('')
  const [tiktokChannelName, setTiktokChannelName] = useState('')

  // Get the channel name for the currently connected user
  useContractRead({
    ...props.tiktokContract,
    functionName: 'getChannel',
    watch: true,
    args: [address],
    onSuccess(data) {
      setTiktokChannelName(data)
    },
    onError(error) {
      console.log(`Error while getting channel name for "${address}": ${error}`)
    },
  })

  const { data: signer } = useSigner()
  const contract = useContract({
    ...props.tiktokContract,
    signerOrProvider: signer,
  })
  // Create a new tiktok channel
  const createTiktokChannel = async () => {
    await contract.addChannel(newTiktokChannelName)
    setNewTiktokChannelName('')
  }

  return (
    <>
      <Row>
        <h3 className='text-5xl font-bold mb-20'>{'Your Tiktok Channel'}</h3>
      </Row>

      {tiktokChannelName ? (
        <Row>
          <Col md='auto'>Channel Name: {tiktokChannelName}</Col>
          <Col md='auto'>
            <AddVideo contract={contract} />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col>
            <Form>
              <Form.Group className='mb-3' controlId='channelName'>
                <Form.Control
                  type='text'
                  placeholder='Enter your channel name'
                  onChange={(e) => setNewTiktokChannelName(e.target.value)}
                />
                <Button variant='primary' onClick={createTiktokChannel}>
                  Create Tiktok Channel
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      )}
    </>
  )
}

export default TiktokProfile
