// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// TikTok clone contract
contract Tiktok {
    // Struct to represent a channel
    struct Channel {
        address channelAddress;
        string channelName;
    }

    // Struct to represent a video
    struct Video {
        string videoURL;
        string songUsed;
        string description;
        uint256 numLikes;
        uint256 numMessages;
        uint256 numShares;
        Channel channel;
    }

    // Mapping from channel addresses to Channel structs
    mapping(address => Channel) private _channels;

    // Integer to keep track of the total number of channels
    uint256 public totalNumOfChannels;

    // Mapping to check whether the channel exists
    mapping(address => bool) public doesChannelExist;

    // Array to store all the videos
    Video[] private _videos;

    // Event to be emitted when a new channel is added
    event NewChannel(address indexed channelAddress, string channelName);

    // Event to be emitted when a new video is added
    event NewVideo(
        uint256 indexed videoIndex,
        string videoURL,
        string songUsed,
        string description,
        address creator
    );

    // Event to be emitted when a video is liked
    event VideoLiked(uint256 indexed videoIndex, uint256 numLikes);

    // Event to be emitted when a video is unliked
    event VideoUnliked(uint256 indexed videoIndex, uint256 numLikes);

    // Function to add a new channel to the contract
    function addChannel(string memory _channelName) public {
        // Ensure that the channel doesn't already exist
        require(
            !doesChannelExist[msg.sender],
            "Channel already exists for this user"
        );

        // Create a new Channel struct and add it to the mapping
        Channel memory newChannel = Channel(msg.sender, _channelName);
        _channels[msg.sender] = newChannel;

        // Set doesChannelExist value to true
        doesChannelExist[msg.sender] = true;

        // Incremenet the total number of channels
        totalNumOfChannels++;

        // Emit the NewChannel event
        emit NewChannel(msg.sender, _channelName);
    }

    // Function to add a new video to the contract
    function addVideo(
        string memory _videoURL,
        string memory _songUsed,
        string memory _description
    ) public {
        // Ensure that the channel exists
        require(doesChannelExist[msg.sender], "Channel does not exist");

        // Create a new Video struct and add it to the array
        Video memory newVideo = Video(
            _videoURL,
            _songUsed,
            _description,
            0,
            0,
            0,
            _channels[msg.sender]
        );
        _videos.push(newVideo);

        // Emit the NewVideo event
        emit NewVideo(
            _videos.length - 1,
            _videoURL,
            _songUsed,
            _description,
            msg.sender
        );
    }

    // Function to like a video
    function likeVideo(uint256 _videoIndex) public {
        // Ensure that the video index is valid
        require(_videoIndex < _videos.length, "Invalid video index");

        // Increment the number of likes for the video
        _videos[_videoIndex].numLikes++;

        // Emit the VideoLiked event
        emit VideoLiked(_videoIndex, _videos[_videoIndex].numLikes);
    }

    // Function to unlike a video
    function unlikeVideo(uint256 _videoIndex) public {
        // Ensure that the video index is valid
        require(_videoIndex < _videos.length, "Invalid video index");
        // Ensure that the video has at least 1 like
        if (_videos[_videoIndex].numLikes > 0) {
            // Decrement the number of likes for the video
            _videos[_videoIndex].numLikes--;

            // Emit the VideoUnliked event
            emit VideoUnliked(_videoIndex, _videos[_videoIndex].numLikes);
        }
    }

    // Function to get a channel's profile
    function getChannel(
        address _channelAddress
    ) public view returns (string memory) {
        // Ensure that the channel exists
        require(doesChannelExist[_channelAddress], "Channel does not exist");

        // Return the user's channel name
        return _channels[_channelAddress].channelName;
    }

    // Function to get a video by its index in the array
    function getVideo(
        uint256 _videoIndex
    )
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        // Ensure that the video index is valid
        require(_videoIndex < _videos.length, "Invalid video index");

        // Return the video's URL, song used, description, number of likes, number of messages, number of shares and the creator
        return (
            _videos[_videoIndex].videoURL,
            _videos[_videoIndex].songUsed,
            _videos[_videoIndex].description,
            _videos[_videoIndex].numLikes,
            _videos[_videoIndex].numMessages,
            _videos[_videoIndex].numShares,
            _videos[_videoIndex].channel.channelAddress
        );
    }

    // Function to get the total number of videos
    function totalNumOfVideos() public view returns (uint256) {
        return _videos.length;
    }
}
