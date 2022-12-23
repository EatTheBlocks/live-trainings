import { useState } from 'react'
import './TiktokFeed.css'

import { useContractRead } from 'wagmi'
import Video from './components/Video'

function TiktokFeed(props) {
  const [videos, setVideos] = useState([])

  // Get the total number of videos
  useContractRead({
    ...props.tiktokContract,
    functionName: 'getAllVideos',
    watch: true,
    onSuccess(data) {
      let _videos = []
      for (let i = 0; i < data.length; i++) {
        const channelAddress = data[i].channel.channelAddress
        _videos.push({
          url: data[i].videoURL,
          channel: `${data[i].channel.channelName}: ${channelAddress.substring(
            0,
            8
          )}...${channelAddress.slice(-3)}`,
          description: data[i].description,
          song: data[i].songUsed,
          likes: data[i].numLikes.toNumber(),
          messages: data[i].numMessages.toNumber(),
          shares: data[i].numShares.toNumber(),
        })
      }
      setVideos(_videos)
    },
    onError(error) {
      console.log(`Error while getting the videos: ${error}`)
    },
  })

  return (
    <div className='app'>
      <div className='container'>
        {videos.map((video, index) => {
          return (
            <Video
              key={index}
              tiktokContract={props.tiktokContract}
              videoIndex={index}
              channel={video.channel}
              description={video.description}
              song={video.song}
              likes={video.likes}
              shares={video.shares}
              messages={video.messages}
              url={video.url}
            />
          )
        })}
      </div>
    </div>
  )
}

export default TiktokFeed
