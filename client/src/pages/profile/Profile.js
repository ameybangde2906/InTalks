import { CalendarMonth, Check, Edit, LogoutOutlined } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { formatDate } from '../../utils/formatDate';
import PodcastCards from '../../components/common/PodcastCards';
import { endPoint } from '../../utils/Constants';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import useFollow from '../../hooks/useFollow';
import useUpdateUserProfile from '../../hooks/useUpdateUserProfile';
import sampleCover from '../../images/cover.jpeg';
import { useDispatch } from 'react-redux';
import { openSignin } from '../../redux/slices/setSignInSlice';

const Container = styled.div`
  padding: 0 8%;
  font-family: Arial, sans-serif;
  overflow-x: auto;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
const CoverImage = styled.img`
width: 95%;
height: 100%;
margin-top: 2%;
border-radius: 20px;
color:${({ theme }) => theme.text_primary};
@media (max-width:700px) {
  height: 80%;
  width: 100%;
  }
`
const ProfileImage = styled.img`
  width: 210px;
  height: 210px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.text_primary};
  @media (max-width:700px) {
    width: 150px;
    height: 150px;
  }
`;

const Initials = styled.div`
position: absolute;
top: 50%;
left: 55%;
transform: translate(-50%,-50%);
letter-spacing: 10px; 
color:${({ theme }) => theme.primary};
font-size: 50px;
font-weight: 800;
`
const ProfileDetails = styled.div`
padding: 3% 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  @media (max-width:700px) {
    padding: 0 7% 5% 7%;
  }
`;

const UserName = styled.h1`
font-size: 30px;
font-weight: 700;
color:${({ theme }) => theme.text_primary};
text-transform: capitalize;
@media (max-width:700px) {
  font-size: 20px;
  }
`;
const UserDetails = styled.div`
color: gray;
font-size: 15px;
letter-spacing: 1px;
@media (max-width:700px) {
  font-size: 12px;
  }
`;

const UserEmail = styled.div`
font-size: 13px;
color: cornflowerblue;
letter-spacing: 2px;
@media (max-width:700px) {
  font-size: 12px;
  }
`;

const Date = styled.div`
color: grey;
font-size: 12.5px;
letter-spacing: 1px;
@media (max-width:700px) {
  font-size: 12px;
  }
`
const LogoutButton = styled.button`
color: ${({ theme }) => theme.text_primary};
background-color:${({ theme }) => theme.primary};
font-size: 14px;
font-weight: 700;
margin-top: 20px;
padding: 6px 20px;
width: 100px;
display: flex;
align-items: center;
justify-content: center;
gap: 5px;
border-radius: 18px;
&:hover{
  color:${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.text_primary};
}
@media (max-width:700px) {
  width: 80px;
  font-size: 12px;
  }
`
const SubscribeButton = styled.button`
color: ${({ theme }) => theme.bg};
background-color:${({ theme }) => theme.text_primary};
font-size: 14px;
font-weight: 500;
margin-top: 20px;
padding: 6px 10px;
width: 120px;
display: flex;
align-items: center;
justify-content: center;
gap: 5px;
border-radius: 18px;
&:hover{
  color:${({ theme }) => theme.primary};
}
`
const Camera = styled.div`
color: ${({ theme }) => theme.text_primary};
border-radius: 50%;
background-color: cornflowerblue;
padding: 4px;
`
const VideosSection = styled.div`
  width: 100%;
  min-height:400px ;
  margin-bottom: 20px;
`;

const Buttons = styled.div`
display: flex;
margin-left: 4%;
gap: 2%;
margin-bottom: 30px;
`
const Button = styled.button`
width: 70px;
height: 30px;
border: none;
outline: none;
color: ${({ theme }) => theme.text_secondary};
border-bottom: ${(props) => props.active ? `2px solid ${props.theme.text_secondary}` : 'none'};
`


const Profile = () => {
  const dispatch = useDispatch()
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { userid } = useParams()
  const queryClient = useQueryClient();
  const { feedType } = useParams()
  const [feedTypes, setFeedTypes] = useState(feedType || 'videos')
  const navigate = useNavigate()
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const { follow, isPending } = useFollow();
  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile()

  const { data: user, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`${endPoint}/api/users/profile/${userid}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;

      } catch (error) {
        throw new Error(error);
      }
    }
  })
  const amISubscribing = authUser?.subscribing.includes(user?._id)
  const isMyProfile = authUser?._id === user?._id
  const userName = user?.fullname
  const words = userName?.split(' ');
  const initials = words?.map(word => word[0].toUpperCase()).join('');

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`${endPoint}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong")
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  })

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImage(reader.result);
        state === "profileImg" && setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignIn = () => {
    dispatch(openSignin())
  }

  useEffect(() => {
    refetch()
  }, [userid, refetch])

  return (
    <Container>
      <div className=' h-[30%] relative group/cover'>
        <CoverImage
          src={coverImage || user?.coverImage || sampleCover}
          alt="cover image"
          onClick={() => coverImgRef.current.click()}
        />

        <div className='absolute top-[10%] right-[7%] bg-primary rounded-full group-hover/cover:opacity-100 opacity-0 cursor-pointer'>
          {isMyProfile &&
            (<Camera><Edit
              className='w-4 h-4'
              onClick={() => coverImgRef.current.click()}
            /></Camera>)}
        </div>
      </div>

      <ProfileSection>

        <div className='rounded-full relative group/avatar'>
          <ProfileImage
            src={profileImage || user?.profileImage}
            alt=""
            onClick={() => profileImgRef.current.click()}
          />
          {!profileImage && !user?.profileImage && <Initials>{initials}</Initials>}

          <div className='absolute top-[15%] right-[15%] bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
            {isMyProfile &&
              (<Camera><Edit
                className='w-4 h-4'
                onClick={() => profileImgRef.current.click()}
              /></Camera>)}
          </div>

        </div>

        <input
          type='file'
          hidden
          ref={coverImgRef}
          onChange={(e) => handleImgChange(e, "coverImg")}
        />
        <input
          type='file'
          hidden
          ref={profileImgRef}
          onChange={(e) => handleImgChange(e, "profileImg")}
        />
        <ProfileDetails>
          <UserName>{user?.fullname}</UserName>
          <UserDetails>@{user?.username} . {user?.subscribers.length} subscribers . </UserDetails>
          <Date><CalendarMonth sx={{ fontSize: 'medium' }} /> joined on - {formatDate(user?.createdAt)}</Date>
          <UserEmail>{user?.email}</UserEmail>

          <div className='flex gap-3'>
            {isMyProfile && (coverImage || profileImage) &&
              <LogoutButton
                onClick={async (e) => {
                  await updateProfile({ coverImage, profileImage });
                  setProfileImage(null);
                  setCoverImage(null);

                }}>
                {isUpdatingProfile ? "Updating..." : "Update"}
              </LogoutButton>}
            {isMyProfile &&
              <LogoutButton
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/`)
                  logout()

                }}>
                <LogoutOutlined sx={{ fontSize: 'large' }} /> Logout
              </LogoutButton>}

          </div>


          {!isMyProfile && authUser && <div onClick={() => follow(user?._id)}>
            {!isPending && !amISubscribing && <SubscribeButton>Subscribe</SubscribeButton>}
            {!isPending && amISubscribing && <SubscribeButton>Subscribed <Check fontSize='small' style={{ fontWeight: "bolder" }} /></SubscribeButton>}
            {isPending && <SubscribeButton>...</SubscribeButton>}
          </div>}
          {!authUser && <SubscribeButton onClick={handleSignIn}>Subscribe</SubscribeButton>}

        </ProfileDetails>
      </ProfileSection>
      <Buttons>
        <Link to={`/profile/${userid}/videos`}>
          <Button active={feedTypes === 'videos'} onClick={() => setFeedTypes('videos')}>Videos</Button>
        </Link>
        <Link to={`/profile/${userid}/playlists`}>
          <Button active={feedTypes === 'playlists'} onClick={() => setFeedTypes('playlists')}>Playlists</Button>
        </Link>
        {isMyProfile && <Link to={`/profile/${userid}/saved`}>
          <Button active={feedTypes === 'saved'} onClick={() => setFeedTypes('saved')}>Saved</Button>
        </Link>}
        {isMyProfile && <Link to={`/profile/${userid}/liked`}>
          <Button active={feedTypes === 'liked'} onClick={() => setFeedTypes('liked')}>Liked</Button>
        </Link>}
      </Buttons>

      <VideosSection>
        <Routes>
          <Route path="/" element={<PodcastCards feedType={feedTypes} userId={userid} />} />
          <Route path="videos" element={<PodcastCards feedType={feedTypes} userId={userid} />} />
          <Route path="playlists" eelement={<PodcastCards feedType={feedTypes} userId={userid} />} />
          {isMyProfile && <Route path="saved" element={<PodcastCards feedType={feedTypes} userId={userid} />} />}
          {isMyProfile && <Route path="liked" element={<PodcastCards feedType={feedTypes} userId={userid} />} />}
        </Routes>
      </VideosSection>

    </Container>
  );
};



export default Profile;
