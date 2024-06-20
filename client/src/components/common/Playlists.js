import React, { useEffect } from 'react';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import {  PlaylistPlay } from '@mui/icons-material';


const Episodes = styled.div`
width: 90px;
height: 26px;
border-radius: 8px;
display: flex;
justify-content: center;
align-items: center;
position: absolute;
font-size: 12px;
font-weight: 500;
letter-spacing: 1px;
gap: 3px;
top: 44%;
right: 7%;
background-color: ${({theme})=>theme.bgLight};
color: ${({theme})=>theme.text_secondary};
`

const Card = styled.div`
position:relative;
text-decoration:none;
width:280px;
height:280px;
display:flex;
flex-direction:column;
justify-content:flex-start;
align-items:center;
padding: 10px ;
border-radius: 6px;
&:hover{
    cursor:pointer;
    transform:translateY(-8px);
    transition:all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0,0,0,0.3);
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
`;
const CardInformation = styled.div`
display:flex;
align-items:flex-end;
font-weight:450px;
padding:6px 5px 0px 6px;
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
font-size: 14px;
overflow:hidden;
display:-webkit-box;
max-width:100%;
-webkit-line-clamp:2;
-webkit-box-orient:vertical;
height: 30px;
text-overflow:ellipsis;
color:${({ theme }) => theme.text_primary};

`;
const CreatorsInfo = styled.div`
display:flex;
flex-direction: column;
gap: 8px;
margin-top: 6px;
`;

const Views = styled.div`
font-size: 12px;
color:${({ theme }) => theme.text_secondary};
width:max-content;
`;

const Playlists = ({ upload }) => {
    return (
        <>
            <Card>
                <Link to={`/${upload.user.fullname}/playlist/${upload?._id}`}>
                    <div>
                        <Top>
                            <CardImage src={upload?.coverImg} />
                        </Top>
                        <CardInformation>
                            <MainInfo>
                                <Title>{upload?.podcastName}</Title>
                                <CreatorsInfo>
                                    <Views>View full playlist</Views>
                                </CreatorsInfo>
                            </MainInfo>
                        </CardInformation>
                    </div>
                    <Episodes>
                        <PlaylistPlay fontSize='medium'/> {upload?.episodes?.length} Videos
                    </Episodes>
                </Link>
            </Card >
        </>
    )
}

export default Playlists