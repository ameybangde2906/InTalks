import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
const Video = styled.video`
  width: 100%;
  border-radius: 13px;
`;

const VideoPlayer = ({ videoId }) => {
  const [videoSrc, setVideoSrc] = useState(videoId);

  useEffect(() => {
    setVideoSrc(videoId);
  }, [videoId]);

  return (
    <Video
      key={videoSrc} // Force re-render when videoSrc changes
      controls
      muted
      autoPlay
      onError={(e) => console.error('Error loading video:', e)}
    >
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </Video>
  );
};

export default VideoPlayer;
