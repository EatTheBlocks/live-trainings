import { ConnectButton } from '@rainbow-me/rainbowkit'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import './App.css'
import Tiktok from './artifacts/contracts/Tiktok.sol/Tiktok.json'
import TiktokContractInfo from './TiktokContractInfo'
import TiktokFeed from './TiktokFeed'
import TiktokProfile from './TiktokProfile'

function App() {
  const tiktokContract = {
    address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    abi: Tiktok.abi,
  }

  return (
    <Container>
      <Row>
        <ConnectButton />
      </Row>
      <TiktokContractInfo tiktokContract={tiktokContract} />
      <br />
      <TiktokProfile tiktokContract={tiktokContract} />
      <br />
      <TiktokFeed tiktokContract={tiktokContract} />
    </Container>
  )
}

export default App
