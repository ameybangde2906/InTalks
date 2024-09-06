import React, { useState } from 'react'
import styled from 'styled-components'
import { formatDate } from '../../utils/formatDate'
import { Person } from '@mui/icons-material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { endPoint } from '../../utils/Constants'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openSignin } from '../../redux/slices/setSignInSlice'
import { getInitials } from '../../utils/Initials'

const Container = styled.div`
width: 100%;
padding: 30px 0 70px 20px ;
color: ${({ theme }) => theme.text_secondary};
`
const Title = styled.div`
font-size: 16px;
font-weight: 500;
`
const Hr = styled.hr`
color: ${({ theme }) => theme.text_secondary};
margin-bottom: 20px;
`
const WriteComment = styled.div`
display: flex;
margin-bottom: 30px;
gap: 10px;
`
const Box = styled.div`
display: flex;
gap: 10px;
height: 60px;
margin: 10px 0;
`
const UserImg = styled.div`
border-radius: 50%;
font-size: 14px;
font-weight: 700;
color:${({ theme }) => theme.bg};
background-color: ${({ theme }) => theme.text_primary};
width: 28px;
height: 28px;
display: flex;
justify-content: center;
align-items: center;
`
const Img = styled.img`
width: 28px;
height: 28px;
border-radius: 50%;
`
const Input = styled.input`
&:focus{outline:none}
border:1px solid gray;
border-radius: 10px;
width: 60%;
color:  ${({ theme }) => theme.text_secondary};
font-size: 13px;
padding: 1px 3px 1px 8px;
`
const Button = styled.button`
width: 100px;
padding: 5px;
background: ${({ theme }) => theme.button_text};
color: ${({ theme }) => theme.text_primary};
border-radius: 12px;
font-size: 13px;
font-weight: 500;
`
const UserInfo = styled.div`
`
const Name = styled.div`
font-weight:500;
font-size: 13px;
width: 150px;
`
const Date = styled.div`
font-size: 11px;
margin-left: 20px;
`
const Text = styled.div`
font-size: 14px;
margin-top: 5px;
`
const CommentSection = ({ data }) => {
    const [comment, setComment] = useState("");
    const dispatch = useDispatch()
    const { data: authUser } = useQuery({ queryKey: ["authUser"] })
    const queryClient = useQueryClient();
    const podcastId = data?._id
    const { mutate: commentPodcast, isPending: isCommenting } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch(`${endPoint}/api/upload/comment/${podcastId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ text: comment }),
                })

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            setComment("");
            queryClient.invalidateQueries({ queryKey: ["uploads"] });
        },
        onError: (error) => {
            throw new Error(error);
        }
    })

    const handlePostComment = (e) => {
        e.preventDefault();
        if (isCommenting) return;
        commentPodcast();
    };

    const handleSignIn = () => {
        dispatch(openSignin())
    }

    return (
        <Container>
            <Title>{data?.comments?.length} Comments</Title>

            <Hr />

            <WriteComment>
                <Link to={`/profile/${authUser?._id}`}>
                   {authUser? <UserImg>
                        {authUser?.profileImage !== "" || null ? <Img src={authUser?.profileImage}/> : <div> {getInitials(authUser?.fullname)}</div>   }
                    </UserImg>
                    :
                    <UserImg><Person/></UserImg>}
                </Link>
                <Input value={comment} onChange={(e) => { setComment(e.target.value) }} placeholder='Add a comment...' />
                {authUser ?
                    <Button onClick={handlePostComment} >{isCommenting ? "..." : "Comment"}</Button>
                    :
                    <Button onClick={handleSignIn} >{isCommenting ? "..." : "Comment"}</Button>
                }
            </WriteComment>

            {data?.comments?.length === 0 && (
                <p className='text-sm text-slate-500'>
                    No comments yet 🤔 Be the first one 😉
                </p>
            )}
            {data?.comments?.map((comment) => (
                <Box>
                    <Link to={`/profile/${comment?.user?._id}`}>
                        <UserImg> {comment?.user?.profileImage !== "" || null ? <Img src={comment?.user?.profileImage} /> : <div>{getInitials(comment?.user?.fullname)}</div>}</UserImg>
                    </Link>

                    <UserInfo>
                        <div className='flex align-middle' > <Link to={`/profile/${comment?.user?._id}`}><Name>@{comment?.user?.username}</Name></Link><Date>{formatDate(comment?.createdAt)}</Date></div>
                        <Text>{comment?.text}</Text>
                    </UserInfo>
                </Box>
            ))}
        </Container>
    )
}

export default CommentSection