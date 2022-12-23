import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import MessageIcon from '@material-ui/icons/Message'
import ShareIcon from '@material-ui/icons/Share'
import { useContract, useSigner } from 'wagmi'
import './VideoSidebar.css'

function VideoSidebar({ tiktokContract, videoIndex, messages, shares, likes }) {
  const { data: signer } = useSigner()
  const contract = useContract({
    ...tiktokContract,
    signerOrProvider: signer,
  })
  // Like the video
  const likeVideo = async () => {
    await contract.likeVideo(videoIndex)
  }
  // Unlike the video
  const unlikeVideo = async () => {
    await contract.unlikeVideo(videoIndex)
  }

  return (
    <div className='videoSidebar'>
      <div className='videoSidebar__button'>
        {likes > 0 ? (
          <FavoriteIcon fontSize='large' onClick={unlikeVideo} />
        ) : (
          <FavoriteBorderIcon fontSize='large' onClick={likeVideo} />
        )}
        <p>{likes}</p>
      </div>
      <div className='videoSidebar__button'>
        <MessageIcon fontSize='large' />
        <p>{messages}</p>
      </div>
      <div className='videoSidebar__button'>
        <ShareIcon fontSize='large' />
        <p>{shares}</p>
      </div>
    </div>
  )
}

export default VideoSidebar
