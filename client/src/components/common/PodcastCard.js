import React from 'react';
import styled from "styled-components";
import { useMutation,useQueryClient } from '@tanstack/react-query';
import { endPoint } from '../../utils/Constants';
import { Link } from 'react-router-dom';
import { getInitials } from '../../utils/Initials';


const Card = styled.div`
position:relative;
text-decoration:none;
background-color:${({ theme }) => theme.card};
width:280px;
height:280px;
display:flex;
flex-direction:column;
justify-content:flex-start;
align-items:center;
padding: 10px ;
border-radius: 6px;
box-shadow:0 0 18px 0 rgba(0,0,0,0.1);
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
`;
const CardInformation = styled.div`
display:flex;
align-items:flex-end;
font-weight:450px;
padding:14px 5px 0px 5px;
width:100%;
`;

const MainInfo = styled.div`
display:flex;
width:100%;
flex-direction:column;
justify-content:flex-start;
gap:4px;
color:${({ theme }) => theme.text_primary};
`;

const Title = styled.div`
overflow:hidden;
display:-webkit-box;
-webkit-line-clamp:2;
-webkit-box-orient:vertical;
height: 45px;
width: 238px;
font-size: 14px;
text-overflow:ellipsis;
text-transform: capitalize;
color:${({ theme }) => theme.text_primary};

`;
const CreatorsInfo = styled.div`
display:flex;
justify-content: space-between;
align-items: center;
gap: 8px;
margin-top: 6px;
`;

const Creator = styled.div`
display: flex;
gap: 8px;
align-items: center;
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

const CreatorName = styled.div`
font-size: 13px;
overflow: hidden;
white-space: nowrap;
text-overflow:ellipsis;
text-transform: capitalize;
color:${({ theme }) => theme.text_secondary};
`;

const Views = styled.div`
font-size: 12px;
color:${({ theme }) => theme.text_secondary};
width:max-content;
`;


const PodcastCard = ({ upload, }) => {

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`${endPoint}/api/upload/saved/${upload._id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",

                    },
                    credentials: "include",
                    body: JSON.stringify()
                })
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                return data
            } catch (error) {
                throw error
            }
        },
        onSuccess: () => {
            // Update the local state

            // Invalidate and refetch the authUser query to get the updated data
            queryClient.invalidateQueries(["authUser"]);
        },
    })


    return (
        <>
            <Card>
                <div>
                    <Link to={`/podcast/${upload._id}`} >
                        <Top>
                            {/* {authUser ?
                                <Favorite onClick={savePost}>
                                    {isPending && <LoadingSpinner />}
                                    {!isSaved ? <FavoriteIcon style={{
                                        width: "16px",
                                        height: "16px",
                                    }} /> :
                                        <FavoriteIcon style={{
                                            width: "16px",
                                            height: "16px",
                                            color: 'red'
                                        }} />}
                                </Favorite>
                                :
                                <Favorite onClick={handleSignIn}>
                                    <FavoriteIcon style={{
                                        width: "16px",
                                        height: "16px",
                                    }} />
                                </Favorite>
                            } */}
                            <CardImage src={upload?.thumbnail} />
                        </Top>
                    </Link>
                    <CardInformation>
                        <MainInfo>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Link to={`/podcast/${upload._id}`}>
                                    <Title>{upload?.episodeName}</Title>
                                </Link>            
                            </div>

                            <CreatorsInfo>
                                <Link to={`/profile/${upload?.user._id}`}>
                                    <Creator>
                                        {upload?.user?.profileImage !== '' && <ProfileImg src={upload?.user?.profileImage} />}
                                        {upload?.user?.profileImage === '' && <NameDiv >{getInitials(upload?.user?.fullname)}</NameDiv>}
                                        <CreatorName>{upload?.user?.fullname}</CreatorName>
                                    </Creator>
                                </Link>
                                <Views>{upload?.views} views</Views>
                            </CreatorsInfo>
                        </MainInfo>
                    </CardInformation>
                </div>
            </Card>

        </>
    )
}

export default PodcastCard   