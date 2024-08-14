import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { endPoint } from '../../utils/Constants';
import { getInitials } from '../../utils/Initials';
import CardSkeleton from '../../components/skeletons/CardSkeleton';

const PlayIcon = styled.div`
padding:10px;
border-radius: 50%;
z-index:100;
display: flex;
align-items: center;
background: #9000ff !important;
color: white !important;
backdrop-filter:blur(4px);
-webkit-backdrop-filter:blur(4px);
position:absolute !important;
top:45%;
right: 10%;
display: none;
transition: all 0.4s ease-in-out;
box-shadow: 0 0 16px 4px #9000ff50 !important;
`

const Card = styled.div`
margin-top: 10px;
position:relative;
text-decoration:none;
background-color:${({ theme }) => theme.card};
max-width:280px;
height:280px;
display:flex;
flex-direction:column;
justify-content:flex-start;
align-items:center;
padding: 10px ;
border-radius: 6px;
box-shadow:0 0 18px 0 rgba(0,0,0,0.1);
&:hover{
    cursor:pointer;
    transform:translateY(-8px);
    transition:all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0,0,0,0.3);
}
&:hover ${PlayIcon}{
    display: flex;
}
`;

const Top = styled.div`
display:flex;
justify-content:center;
align-items:center;
height:150px;
position:relative;
`;

const CardImage = styled.img`
object-fit: fill;
width:260px;
height:150px;
border-radius:6px;
box-shadow: 0 4px 30px rgba(0,0,0, 0.3);
&:hover {
    box-shadow: 4px 30px rgba(0, 0, 0, 0.4)
}
`;
const CardInformation = styled.div`
display:flex;
align-items:flex-end;
font-weight:450px;
padding:14px 0px 0px 0px;
width:100%;
`
  ;

const MainInfo = styled.div`
display:flex;
width:100%;
flex-direction:column;
justify-content:flex-start;
gap:4px;
`;
const Title = styled.div`
overflow:hidden;
display:-webkit-box;
max-width:100%;
-webkit-line-clamp:2;
-webkit-box-orient:vertical;
height: 45px;
text-overflow:ellipsis;
color:${({ theme }) => theme.text_primary};

`;
const CreatorsInfo = styled.div`
display:flex;
justify-content: space-between;
align-items: center;
gap: 8px;
margin-top: 6px;
`;
const NameDiv = styled.div`
width: 30px;
height: 30px;
border-radius: 50%;
font-size: 14px;
font-weight: 700;
display: flex;
align-items: center;
justify-content: center;
color:${({ theme }) => theme.bg};
background-color: ${({ theme }) => theme.text_primary};
`
const ProfileImg = styled.img`
width: 30px;
height: 30px;
border-radius: 50%;
`

const Creator = styled.div`
display: flex;
gap: 8px;
align-items: center;
`;

const CreatorName = styled.div`
font-size: 14px;
overflow: hidden;
white-space: nowrap;
text-overflow:ellipsis;
color:${({ theme }) => theme.text_secondary};
`;

const Views = styled.div`
font-size: 12px;
color:${({ theme }) => theme.text_secondary};
width:max-content;
`;

const RelatedPodcast = ({ podcastId }) => {

  const { data: upload, isLoading, isRefetching } = useQuery({
    queryKey: ["related"],
    queryFn: async () => {
      const res = await fetch(`${endPoint}/api/upload/related/${podcastId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }
      return res.json();
    },
  });

  const skeletonCount = upload ? upload.length : 0;

  return (
    <>
      {upload?.length > 0 && <div>
        <h3>You may also like : </h3>
        {(isLoading || isRefetching) &&
          [...Array(skeletonCount)].map((_, index) => (
            <CardSkeleton key={index} />
          ))
        }
        
        {!isLoading && !isRefetching && <div>
          {upload.map((podcast) => (<Link to={`/podcast/${podcast?._id}`} >
            <Card feedType={podcast?.episodeCategory}>
              <div>
                <Top>
                  <CardImage src={podcast?.thumbnail} />
                </Top>
                <CardInformation>
                  <MainInfo>
                    <Title>{podcast?.episodeName}</Title>
                    <CreatorsInfo>
                      <Link to={`/profile/${podcast?.user?._id}`}>
                        <Creator>
                          {podcast?.user?.profileImage !== '' && <ProfileImg src={podcast?.user?.profileImage} />}
                          {podcast?.user?.profileImage == '' && <NameDiv >{getInitials(podcast?.user?.fullname)}</NameDiv>}
                          <CreatorName>{podcast?.user?.fullname}</CreatorName>
                        </Creator>
                      </Link>

                      {podcast?.views > 0 ?
                        <Views>{podcast?.views} views</Views> :
                        <Views>0 views</Views>}
                    </CreatorsInfo>
                  </MainInfo>
                </CardInformation>
              </div>
            </Card>
          </Link>))}
        </div>}
      </div>}
    </>
  )
}

export default RelatedPodcast