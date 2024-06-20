import React from 'react'
import styled from 'styled-components'
import { Check, ThumbUp, ThumbUpAltOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useFollow from '../../hooks/useFollow';
import { endPoint } from '../../utils/Constants';
import { useDispatch } from 'react-redux';
import { openSignin } from '../../redux/slices/setSignInSlice';

const Details = styled.div`
color: ${({ theme }) => theme.text_secondary};
width: 100%;
padding: 10px;
`
const PodcastName = styled.div`
color: ${({ theme }) => theme.text_secondary};
font-size: 20px;
font-weight: 500;
margin-bottom: 10px;
display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5; /* Optional: set the line height for spacing */
  max-height: 3em; /* 2 lines * line-height (1.5) */
`
const ProfileImg = styled.div`
border-radius: 50%;
border: 1px solid ${({ theme }) => theme.text_secondary};
width: 40px;
height: 40px;
display: flex;
justify-content: center;
align-items: center;
color: ${({ theme }) => theme.primary};
margin-right: 10px;
cursor: pointer;
`
const OwnerInfo = styled.div`
color: ${({ theme }) => theme.text_secondary};
display: flex;
flex-direction: row;
align-items: center;
margin-top: 6px;
`
const Name = styled.div`
font-size: 15px;
font-weight: 700;
`
const Subscriber = styled.div`
font-size: 13px;
`
const FollowButton = styled.button`
width: 120px;
font-weight: 500;
font-size:14px ;
padding: 8px;
background-color: ${({ theme }) => theme.text_secondary};
color: ${({ theme }) => theme.card};
border-radius: 20px;
display: flex;
align-items: center;
justify-content: space-around;
gap: 3px;
`
const LikeButton = styled.button`
width: 90px;
font-weight: 500;
font-size:14px ;
padding: 8px;
background-color: ${({ theme }) => theme.text_secondary};
color: ${({ theme }) => theme.card};
border-radius: 20px;
display: flex;
align-items: center;
justify-content: space-around;
gap: 6px;
`

const OwnerDetails = ({ data, loading }) => {
    const queryClient = useQueryClient();
    const userName = data?.user?.fullname
    const words = userName?.split(' ');
    const initials = words?.map(word => word[0].toUpperCase()).join('');
    const dispatch = useDispatch()

    const podcastId = data?._id
    const { data: authUser } = useQuery({ queryKey: ["authUser"] })
    const isMyPodcast = authUser?._id === data?.user?._id
    const amISubscribing = authUser?.subscribing.includes(data?.user?._id)
    const isLiked = data?.likes?.includes(authUser?._id)
    const { follow, isPending } = useFollow();

    const { mutate: likePodcast, isPending: isLiking } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`${endPoint}/api/upload/like/${podcastId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong")
                }
                return data;
            } catch (error) {

            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["uploads"] });
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },

        onError: (error) => {
            console.error("Error occurred during likePodcast mutation:", error);
            throw new Error(error.message)
        }
    })


    const handleLikePost = () => {
        if (isLiking) return;
        likePodcast();
    };

    const handleSignIn = () => {
        dispatch(openSignin())
    }


    return (
        <Details>
            
            <PodcastName>{data.episodeName}</PodcastName>
            <OwnerInfo>

                <div className='flex'>
                    <Link to={`/profile/${data?.user?._id}`} >
                        <ProfileImg>
                            {data?.user?.profileImage === '' ?
                                <div>{initials}</div> :
                                <img src={data?.user?.profileImage} alt='' style={{ width: "40px", height:"40px", borderRadius: "50%" }} />}
                        </ProfileImg>
                    </Link>


                    <div >
                        <Name>{data?.user?.fullname}</Name>
                        <Subscriber>{data?.user?.subscribers?.length} subscribers</Subscriber>
                    </div>

                </div>

                <div>
                    {!isMyPodcast && authUser && <div className='ml-20' onClick={() => follow(data?.user?._id)}>
                        {!isPending && !amISubscribing && <FollowButton>Subscribe</FollowButton>}
                        {!isPending && amISubscribing && <FollowButton>Subscribed <Check style={{ fontWeight: "bolder" }} /></FollowButton>}
                        {isPending && <FollowButton>...</FollowButton>}
                    </div>}
                    {!authUser && <div className='ml-20'><FollowButton onClick={handleSignIn}>Subscribe</FollowButton></div>}
                </div>

                {authUser ? <div className='ml-6' onClick={handleLikePost}>
                    {isPending && <LikeButton>
                        <ThumbUpAltOutlined sx={{ width: '18px' }} />{data?.likes?.length} ...
                    </LikeButton>}
                    {!isLiked && !isPending && <LikeButton>
                        <ThumbUpAltOutlined sx={{ width: '18px' }} />{data?.likes?.length} Like
                    </LikeButton>}
                    {isLiked && !isPending && <LikeButton>
                        <ThumbUp sx={{ width: '18px' }} />{data?.likes?.length} Liked
                    </LikeButton>}
                </div> : <div className='ml-6'><LikeButton onClick={handleSignIn}>
                    <ThumbUpAltOutlined sx={{ width: '18px' }} />{data?.likes?.length} Like
                </LikeButton></div>}

            </OwnerInfo>

        </ Details>
    )
}

export default OwnerDetails