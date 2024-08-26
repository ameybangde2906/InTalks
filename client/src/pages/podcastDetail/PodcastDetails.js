import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { endPoint } from '../../utils/Constants';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import VideoPlayer from './VideoPlayer';
import RelatedPodcast from './RelatedPodcast';
import OwnerDetails from './OwnerDetails';
import CommentSection from './CommentSection';
import { formatDate } from '../../utils/formatDate'
import PodcastDetailSkeleton from '../../components/skeletons/PodcastDetailSkeleton';

const MainConatiner = styled.div`
padding:2%;
overflow-y: auto;
display: flex;
flex-direction: row;
@media(max-width:1000px){
   flex-direction: column;
}
`
const VideoContainer = styled.div`
width: 70%;
display: flex;
padding: 10px;
flex-direction: column;
@media(max-width:1000px){
   width: 100%;
}
`

const Description = styled.div`
border-radius: 13px;
margin-top: 10px;
font-size: 14px;
background-color: ${({ theme }) => theme.card};
color: ${({ theme }) => theme.text_secondary};
padding: 15px;
`
const RelatedVideos = styled.div`
display: flex;
justify-content: center;
color: ${({ theme }) => theme.text_secondary};
padding-left: 4%;
`
const VideoDescription = styled.div`
margin: 0 10px;
font-size: 13px;
letter-spacing: 1px;
`
const Date = styled.div`
margin: 0 10px;
`
const Views = styled.div`
margin: 0 10px;
`

const PodcastDetails = () => {
  const { id: podcastId } = useParams();

  const { data, isLoading, isRefetching, isError, error, refetch } = useQuery({
    queryKey: ["uploads"],
    queryFn: async () => {
      const res = await fetch(`${endPoint}/api/upload/podcast/${podcastId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }
      const data = await res.json();
      return data;
    },
  });

  useEffect(() => {
    if (podcastId) {
      refetch(); // refetch data when podcastId changes
    }
  }, [podcastId, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }



  return (
    <MainConatiner>

      <VideoContainer>
        <VideoPlayer videoId={data?.audioVideo} />

        <OwnerDetails data={data} loading={isLoading} refetching={isRefetching} />

        {(isLoading || isRefetching) &&
          <PodcastDetailSkeleton />
        }

        {!isLoading && !isRefetching && data && <Description>
          <div className='flex mb-3 font-bold'>
            <Views>
              {data.views}
              <span className='ml-2'>views</span>
            </Views>
            <Date>{formatDate(data?.createdAt)}</Date>
          </div>

          <VideoDescription>
            {data.episodeDescription}
          </VideoDescription>
        </Description>}

        <CommentSection data={data} />
      </VideoContainer >

      <RelatedVideos>
        <RelatedPodcast podcastId={podcastId} podcastCategory={data?.episodeCategory} />
      </RelatedVideos>

    </MainConatiner>
  );
};

export default PodcastDetails;
