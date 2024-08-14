import React from 'react'
import styled from 'styled-components'

const Description = styled.div`
border-radius: 13px;
margin-top: 10px;
background-color: ${({ theme }) => theme.card};
padding: 15px;
`
const VideoDescription = styled.div`
margin: 20px 10px;
width: 90%;
height: 150px;
background-color: ${({ theme }) => theme.bg};
` 

const Views = styled.div`
margin: 0 10px;
width: 200px;
height: 25px;
border-radius: 15px;
background-color: ${({ theme }) => theme.bg};
`

const PodcastDetailSkeleton = () => {
    return (
        <Description>
            <Views></Views>

            <VideoDescription></VideoDescription>
        </Description>
    )
}

export default PodcastDetailSkeleton