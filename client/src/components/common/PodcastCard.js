import React from 'react';
import styled from "styled-components";
import { IconButton } from '@mui/material';
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endPoint } from '../../utils/Constants';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { Link } from 'react-router-dom';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { openSignin } from '../../redux/slices/setSignInSlice';
import { useDispatch } from 'react-redux';


const PlayIcon = styled.div`
padding:10px;
border-radius: 50%;
z-index:10;
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

const Favorite = styled(IconButton)`
color:white;
top:8px;
right:6px;
padding: 6px !important;
border-radius:50%;
z-index:10;
display:flex;
align-items:center;
background:${({ theme }) => theme.text_secondary} !important;
color:white !important;
position: absolute !important;
backdrop-filter:blur(4px);
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
`;

const Title = styled.div`
overflow:hidden;
display:-webkit-box;
max-width:100%;
-webkit-line-clamp:2;
-webkit-box-orient:vertical;
height: 45px;
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
color:${({ theme }) => theme.primary};
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

const PodcastCard = ({ upload }) => {
    const dispatch = useDispatch()
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const isSaved = authUser?.savedPosts?.includes(upload._id)
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

    const handleSignIn = () => {
        dispatch(openSignin())
    }

    const savePost = (e) => {
        e.preventDefault()
        mutate()
    }

    const userName = upload?.user?.fullname
    const words = userName?.split(' ');
    const initials = words?.map(word => word[0].toUpperCase()).join('');

    return (
        <>
            <Link to={`/podcast/${upload._id}`} >
                <Card>
                    <div>
                        <Top>
                            {authUser ?
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
                            }
                            <CardImage src={upload.thumbnail} />
                        </Top>
                        <CardInformation>
                            <MainInfo>
                                <Title>{upload.episodeName}</Title>
                                <CreatorsInfo>
                                    <Link to={`/profile/${upload?.user._id}`}>
                                        <Creator>
                                            {upload?.user?.profileImage !== '' && <ProfileImg src={upload?.user?.profileImage} />}
                                            {upload?.user?.profileImage == '' && <NameDiv >{initials}</NameDiv> }
                                            <CreatorName>{upload.user.fullname}</CreatorName>
                                        </Creator>
                                    </Link>
                                    <Views>{upload.views} views</Views>
                                </CreatorsInfo>
                            </MainInfo>
                        </CardInformation>
                    </div>
                    <PlayIcon>
                        <PlayArrowIcon style={{ width: "28px", height: "28px" }} />
                    </PlayIcon>
                </Card>
            </Link>
        </>
    )
}

export default PodcastCard