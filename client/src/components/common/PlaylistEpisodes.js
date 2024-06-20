import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { endPoint } from '../../utils/Constants';
import styled from 'styled-components';
import { formatDate } from '../../utils/formatDate';

const PlaylistContainer = styled.div`
padding: 20px;
display: flex;
width: 100%;
height: 100%;
@media (max-width:800px) {
  flex-direction: column;
}
`
const PodcastDetails = styled.div`
padding: 20px;
border-radius: 15px;
background-color: darksalmon;
color: white;
@media (max-width:800px) {
  width: 100%;
}
`
const CoverImage = styled.img`
width: 300px;
height: 180px;
border-radius: 15px;
@media (max-width:800px) {
  width: 100%;
  height: 210px;
}
`
const PodcastName = styled.div`
margin-top: 5px;
font-size: 28px;
font-weight: 800;
text-transform: capitalize;
`
const PodcastDescription = styled.div`
font-size: 14px;
margin-top: 2px;
text-transform: capitalize;
`
const PodcastUploaderName = styled.div`
font-size: 14px;
font-weight: 800;
margin-top: 20px;
text-transform: capitalize;
`
const VideosLenth = styled.div`
font-size: 13px;
`
const VideosViews = styled.div`
font-size: 13px;
`
const Date = styled.div`
font-size: 12px;
`

const EpisodeIndex = styled.div`
margin-right: 15px;
`
const EpisodesList = styled.div`
display: flex;
color: ${({ theme }) => theme.text_secondary};
margin-left: 20px;
@media (max-width:800px) {
  margin-left: 0;
  margin-top: 30px;
}
`
const EpisodeImg = styled.img`
width: 200px;
height: 100px;
margin-right: 20px;
`
const EpisodeDetails = styled.div`
font-size: 12px;
`
const EpisodeName = styled.div`
font-size: 20px;
font-weight: 500;
margin-bottom: 5px;
`
const EpisodeUploader = styled.div`
display: flex;
`
const UploaderName = styled.div`
margin-right: 5px;
text-transform: capitalize;
font-weight: 500;
`
const EpisodeViews = styled.div`
margin-right: 5px;
`
const EpisodeDate = styled.div`
`

const PlaylistEpisodes = () => {

  const { playlistId } = useParams();

  const { data: uploads, isLoading: isgettingData } = useQuery({
    queryKey: ["playlist"],
    queryFn: async () => {
      const res = await fetch(`${endPoint}/api/upload/playlistbyid/${playlistId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }
      return res.json();
    }
  });
  console.log(uploads)
  return (
    <>
      <PlaylistContainer>
        <PodcastDetails>
          <CoverImage src={uploads?.coverImg} />
          <PodcastName>{uploads?.podcastName}</PodcastName>
          <PodcastDescription>{uploads?.podcastDescription}</PodcastDescription>
          <PodcastUploaderName>{uploads?.user?.fullname}</PodcastUploaderName>
          <div className='flex gap-2'>
            <VideosLenth>{uploads?.episodes?.length} videos</VideosLenth>
            <VideosViews>{uploads?.episodes.reduce((sum, episode) => sum + episode.views, 0)} views</VideosViews>
            <Date>Added on {formatDate(uploads?.createdAt)}</Date>
          </div>
        </PodcastDetails>


        {uploads?.episodes.map((upload, index) => (
          <EpisodesList key={index}>
            <EpisodeIndex>{index + 1}</EpisodeIndex>
            <EpisodeImg src={upload.thumbnail} />

            <EpisodeDetails>
              <EpisodeName>{upload.episodeName}</EpisodeName>
              <EpisodeUploader>
                <UploaderName>{uploads.user.fullname}</UploaderName>
                <EpisodeViews>{upload.views} views</EpisodeViews>
                <EpisodeDate>{formatDate(upload.createdAt)}</EpisodeDate>
              </EpisodeUploader>
            </EpisodeDetails>

          </EpisodesList>))}

      </PlaylistContainer>
    </>
  )
}

export default PlaylistEpisodes