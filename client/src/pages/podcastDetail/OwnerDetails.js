import React from 'react'
import styled from 'styled-components'
import { Check, Favorite, FavoriteBorder, ThumbUp, ThumbUpAltOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useFollow from '../../hooks/useFollow';
import { endPoint } from '../../utils/Constants';
import { useDispatch } from 'react-redux';
import { openSignin } from '../../redux/slices/setSignInSlice';
import { getInitials } from '../../utils/Initials';
import OwnerDetailSkeleton from '../../components/skeletons/OwnerDetailSkeleton';

const Details = styled.div`
color: ${({ theme }) => theme.text_secondary};
width: 100%;
padding: 10px;
`
const PodcastName = styled.div`
color: ${({ theme }) => theme.text};
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
width: 40px;
height: 40px;
display: flex;
justify-content: center;
align-items: center;
color:${({ theme }) => theme.bg};
background-color: ${({ theme }) => theme.text_primary};
font-weight: 700;
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
width: max-content;
`
const Subscriber = styled.div`
font-size: 13px;
`
const FollowButton = styled.button`
width:max-content;
font-weight: 700;
font-size:14px ;
padding: 8px;
background: ${({ theme }) => theme.button_text};
color: ${({ theme }) => theme.bg};
border-radius: 20px;
display: flex;
align-items: center;
justify-content: space-around;
gap: 3px;
@media (max-width: 768px) {
    font-size: 12px;
    padding: 5px;
}
`

const LikeButton = styled.button`
min-width: max-content;
font-weight: 700;
font-size:14px ;
padding: 8px;
background: ${({ theme }) => theme.button_text};
color: ${({ theme }) => theme.bg};
border-radius: 20px;
display: flex;
align-items: center;
justify-content: space-around;
gap: 6px;
@media (max-width: 850px) {
padding: 5px;
}
`
const LikeText=styled.div`
@media (max-width: 768px) {
    display: none;
}
`

const SaveButton = styled.button`
height: 40px;
font-weight: 700;
font-size:14px;
padding: 8px;
margin-left: 15px;
background: ${({ theme }) => theme.button_text};
color: ${({ theme }) => theme.bg};
border-radius: 20px;
display: flex;
align-items: center;
justify-content: space-around;
gap: 6px;

@media (max-width: 850px) {
height: 35px;
}
`

const OwnerDetails = ({ data, loading, refetching }) => {
    const queryClient = useQueryClient();

    const dispatch = useDispatch()

    const podcastId = data?._id
    const { data: authUser } = useQuery({ queryKey: ["authUser"] })
    const isMyPodcast = authUser?._id === data?.user?._id
    const amISubscribing = authUser?.subscribing.includes(data?.user?._id)
    const isLiked = data?.likes?.includes(authUser?._id)
    const { follow } = useFollow();

    const isSaved = authUser?.savedPosts?.includes(podcastId)


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
            queryClient.invalidateQueries({ queryKey: ["uploads"] })
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        },

        onError: (error) => {
            console.error("Error occurred during likePodcast mutation:", error);
            throw new Error(error.message)
        }
    })

    const { mutate: savePodcast, isPending: isSavaing } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`${endPoint}/api/upload/saved/${podcastId}`, {
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
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
            
        },
    })

    const savePost = (e) => {
        e.preventDefault()
        savePodcast()
    }


    const handleLikePost = () => {
        if (isLiking) return;
        likePodcast();
    };

    const handleSignIn = () => {
        dispatch(openSignin())
    }


    return (

        <div>
            {(loading || refetching) &&
                <OwnerDetailSkeleton />
            }

            {!loading && !refetching && data && <Details>

                <PodcastName>{data.episodeName}</PodcastName>
                <OwnerInfo>
                    <div className='flex justify-center items-center'>
                        <div className='flex'>
                            <Link to={`/profile/${data?.user?._id}`} >
                                <ProfileImg>
                                    {data?.user?.profileImage === '' || null ?
                                        <div>{getInitials(data?.user?.fullname)}</div> :
                                        <img src={data?.user?.profileImage} alt='' style={{ width: "40px", height: "40px", borderRadius: "50%" }} />}
                                </ProfileImg>
                            </Link>


                            <div >
                                <Name>{data?.user?.fullname}</Name>
                                <Subscriber>{data?.user?.subscribers?.length} subscribers</Subscriber>
                            </div>

                        </div>

                        <div>
                            {!isMyPodcast && authUser && <div className='ml-4' onClick={() => follow(data?.user?._id)}>
                                { !amISubscribing && <FollowButton>Subscribe</FollowButton>}
                                { amISubscribing && <FollowButton>Subscribed <Check style={{ fontWeight: "bolder", fontSize: '19px' }} /></FollowButton>}
                            </div>}
                            {!authUser && <div className='ml-4'><FollowButton onClick={handleSignIn}>Subscribe</FollowButton></div>}
                        </div>
                    </div>



                    {authUser ? <div className='ml-[25%]' onClick={handleLikePost}>
                        {!isLiked && <LikeButton >
                            <ThumbUpAltOutlined sx={{ width: '18px' }} />{data?.likes?.length} <LikeText>Like</LikeText>
                        </LikeButton>}
                        {isLiked && <LikeButton >
                            <ThumbUp sx={{ width: '18px' }} />{data?.likes?.length} <LikeText>Liked</LikeText>
                        </LikeButton>}
                    </div> : <div className='ml-[25%]'><LikeButton onClick={handleSignIn}>
                        <ThumbUpAltOutlined sx={{ width: '18px' }} />{data?.likes?.length} <LikeText>Like</LikeText>
                    </LikeButton></div>}

                    {authUser ? <div  onClick={savePost}>

                        {!isSaved && <SaveButton onClick={savePost} >
                            <FavoriteBorder sx={{ width: '18px' }} /> <LikeText>Save</LikeText>
                        </SaveButton>}
                        {isSaved && <SaveButton onClick={savePost} >
                            <Favorite sx={{ width: '18px' }} /> <LikeText>Saved</LikeText>
                        </SaveButton>}
                    </div> : <div>
                        <SaveButton onClick={handleSignIn}>
                            <FavoriteBorder sx={{ width: '18px' }} /> <LikeText>Save</LikeText>
                        </SaveButton></div>}
                </OwnerInfo>

            </ Details>}
        </div>
    )
}

export default OwnerDetails