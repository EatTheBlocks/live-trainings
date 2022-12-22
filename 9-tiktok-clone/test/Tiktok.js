const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Tiktok', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [channel1, channel2] = await ethers.getSigners()

    const Tiktok = await ethers.getContractFactory('Tiktok')
    const tiktok = await Tiktok.deploy()

    return { tiktok, channel1, channel2 }
  }

  async function helperCreateChannel(tiktok, channelName) {
    const tx = await tiktok.addChannel(channelName)
    await tx.wait()
  }

  async function helperCreateVideo(tiktok, videoURL, songUsed, description) {
    const tx = await tiktok.addVideo(videoURL, songUsed, description)
    await tx.wait()
  }

  async function helperLikeVideo(tiktok, videoIndex) {
    const tx = await tiktok.likeVideo(videoIndex)
    await tx.wait()
  }

  describe('addChannel', function () {
    it('Should create a new channel', async function () {
      const { tiktok, channel1 } = await loadFixture(deployFixture)

      // Add a new channel
      const channel1Name = 'channel1'
      const tx = await tiktok.addChannel(channel1Name)
      await tx.wait()

      // Check for the result
      const totalNumOfChannels = await tiktok.totalNumOfChannels()
      const doesChannelExist = await tiktok.doesChannelExist(channel1.address)

      expect(totalNumOfChannels).to.equal(1)
      expect(doesChannelExist).to.be.true
    })
  })

  describe('addChannel', function () {
    it('Should revert the tx when a user tries to create two channels', async function () {
      const { tiktok } = await loadFixture(deployFixture)

      // Add a new channel
      const channel1Name = 'channel1'
      const tx = await tiktok.addChannel(channel1Name)
      await tx.wait()

      // Try adding a new channel again for the same user
      const channel2Name = 'channel2'
      await expect(tiktok.addChannel(channel2Name)).to.be.revertedWith(
        'Channel already exists for this user'
      )
    })
  })

  describe('getChannel', function () {
    it('Should get the channel name', async function () {
      const { tiktok, channel1 } = await loadFixture(deployFixture)

      // Add a new channel
      const expectedChannelName = 'channel1'
      await helperCreateChannel(tiktok, expectedChannelName)

      // Get the channel name
      const actualChannelName = await tiktok.getChannel(channel1.address)
      expect(actualChannelName).to.equal(expectedChannelName)
    })
  })

  describe('getChannel', function () {
    it('Should revert the tx because the channel does not exist', async function () {
      const { tiktok, channel1 } = await loadFixture(deployFixture)

      // Get the channel name without creating a channel first
      await expect(tiktok.getChannel(channel1.address)).to.be.revertedWith(
        'Channel does not exist'
      )
    })
  })

  describe('addVideo', function () {
    it('Should add a new video', async function () {
      const { tiktok } = await loadFixture(deployFixture)

      // Create a channel first
      await helperCreateChannel(tiktok, 'channel1')

      // Add a new video
      const videoURL = '/videos/sample_video1.mp4'
      const songUsed = 'Hello by Adele'
      const description = 'The biggest crypto conference in Taiwan'
      const tx = await tiktok.addVideo(videoURL, songUsed, description)
      await tx.wait()

      // Check for the result
      const totalNumOfVideos = await tiktok.totalNumOfVideos()

      expect(totalNumOfVideos).to.equal(1)
    })
  })

  describe('addVideo', function () {
    it("Should revert the tx when adding a video but the channel doesn't exist", async function () {
      const { tiktok } = await loadFixture(deployFixture)

      // Try adding a video without first creating the channel
      const videoURL = '/videos/sample_video1.mp4'
      const songUsed = 'Hello by Adele'
      const description = 'The biggest crypto conference in Taiwan'
      await expect(
        tiktok.addVideo(videoURL, songUsed, description)
      ).to.be.revertedWith('Channel does not exist')
    })
  })

  describe('getVideo', function () {
    it('Should get the video info', async function () {
      const { tiktok, channel1 } = await loadFixture(deployFixture)

      // Create a channel first
      await helperCreateChannel(tiktok, 'channel1')

      // Add a video first
      const expectedVideoURL = '/videos/sample_video1.mp4'
      const expectedSongUsed = 'Hello by Adele'
      const expectedDescription =
        'The bigexpectedVideoURLgest crypto conference in Taiwan'
      await helperCreateVideo(
        tiktok,
        expectedVideoURL,
        expectedSongUsed,
        expectedDescription
      )

      // Check for the result
      const [
        actualVideoURL,
        actualSongUsed,
        actualDescription,
        actualNumLikes,
        actualNumMessages,
        actualNumShares,
        actualChannelAddress,
      ] = await tiktok.getVideo(0)

      expect(actualVideoURL).to.equal(expectedVideoURL)
      expect(actualSongUsed).to.equal(expectedSongUsed)
      expect(actualDescription).to.equal(expectedDescription)
      expect(actualNumLikes).to.equal(0)
      expect(actualNumMessages).to.equal(0)
      expect(actualNumShares).to.equal(0)
      expect(actualChannelAddress).to.equal(channel1.address)
    })
  })

  describe('getVideo', function () {
    it('Should revert the tx because the video does not exist', async function () {
      const { tiktok } = await loadFixture(deployFixture)

      // Create a channel first
      await helperCreateChannel(tiktok, 'channel1')

      // Get the video info without adding a video first
      await expect(tiktok.getVideo(0)).to.be.revertedWith('Invalid video index')
    })
  })

  describe('likeVideo', function () {
    it('Should like the video', async function () {
      const { tiktok } = await loadFixture(deployFixture)

      // Create a channel first
      await helperCreateChannel(tiktok, 'channel1')

      // Add a video first
      const videoURL = '/videos/sample_video1.mp4'
      const songUsed = 'Hello by Adele'
      const description =
        'The bigexpectedVideoURLgest crypto conference in Taiwan'
      await helperCreateVideo(tiktok, videoURL, songUsed, description)

      // Like the video
      const tx = await tiktok.likeVideo(0)
      await tx.wait()

      // Check for the result
      const [
        actualVideoURL,
        actualSongUsed,
        actualDescription,
        actualNumLikes,
        actualNumMessages,
        actualNumShares,
        actualChannelAddress,
      ] = await tiktok.getVideo(0)

      expect(actualNumLikes).to.equal(1)
    })
  })

  describe('likeVideo', function () {
    it('Should revert the tx because the video does not exist', async function () {
      const { tiktok } = await loadFixture(deployFixture)

      // Create a channel first
      await helperCreateChannel(tiktok, 'channel1')

      // Like the video without adding a video first
      await expect(tiktok.likeVideo(0)).to.be.revertedWith(
        'Invalid video index'
      )
    })
  })

  describe('unlikeVideo', function () {
    it('Should unlike the video', async function () {
      const { tiktok } = await loadFixture(deployFixture)

      // Create a channel first
      await helperCreateChannel(tiktok, 'channel1')

      // Add a video first
      const videoURL = '/videos/sample_video1.mp4'
      const songUsed = 'Hello by Adele'
      const description =
        'The bigexpectedVideoURLgest crypto conference in Taiwan'
      await helperCreateVideo(tiktok, videoURL, songUsed, description)

      // Like the video first
      await helperLikeVideo(tiktok, 0)
      const videoInfoBefore = await tiktok.getVideo(0)
      expect(videoInfoBefore[3]).to.equal(1)

      // Unlike the video
      const tx = await tiktok.unlikeVideo(0)
      await tx.wait()

      // Check for the result
      const [
        actualVideoURL,
        actualSongUsed,
        actualDescription,
        actualNumLikes,
        actualNumMessages,
        actualNumShares,
        actualChannelAddress,
      ] = await tiktok.getVideo(0)

      expect(actualNumLikes).to.equal(0)
    })
  })

  describe('unlikeVideo', function () {
    it('Should revert the tx because the video does not exist', async function () {
      const { tiktok } = await loadFixture(deployFixture)

      // Create a channel first
      await helperCreateChannel(tiktok, 'channel1')

      // Unlike the video without adding a video first
      await expect(tiktok.unlikeVideo(0)).to.be.revertedWith(
        'Invalid video index'
      )
    })
  })

  describe('unlikeVideo', function () {
    it('Should unlike the video but the number of likes should never go below 0', async function () {
      const { tiktok } = await loadFixture(deployFixture)

      // Create a channel first
      await helperCreateChannel(tiktok, 'channel1')

      // Add a video first
      const videoURL = '/videos/sample_video1.mp4'
      const songUsed = 'Hello by Adele'
      const description =
        'The bigexpectedVideoURLgest crypto conference in Taiwan'
      await helperCreateVideo(tiktok, videoURL, songUsed, description)

      // Check the current like(This should be 0 by default)
      const videoInfoBefore = await tiktok.getVideo(0)
      expect(videoInfoBefore[3]).to.equal(0)

      // Unlike the video
      const tx = await tiktok.unlikeVideo(0)
      await tx.wait()

      // Check for the result
      const [
        actualVideoURL,
        actualSongUsed,
        actualDescription,
        actualNumLikes,
        actualNumMessages,
        actualNumShares,
        actualChannelAddress,
      ] = await tiktok.getVideo(0)

      expect(actualNumLikes).to.equal(0)
    })
  })
})
