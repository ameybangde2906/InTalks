import React from 'react'
import styled from 'styled-components'

const Video = styled.video`
  width: 100%;
  border-radius: 13px;
  background-color:${({ theme }) => theme.card};
`;

const VideoPlayerSkeleton = () => {
  return (
    <Video></Video>
  )
}

export default VideoPlayerSkeleton