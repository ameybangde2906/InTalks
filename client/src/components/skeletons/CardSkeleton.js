import React from 'react'
import styled from 'styled-components';


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

const CardImage = styled.div`
object-fit: fill;
width:260px;
height:150px;
border-radius:6px;
background-color: ${({theme})=>theme.bgLight};
border: none;
`

const CardInformation = styled.div`
display:flex;
align-items:flex-end;
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
height: 45px;
width: 260px;
background-color: ${({theme})=>theme.bgLight};
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
background-color: ${({theme})=>theme.bgLight};
`
const CreatorName = styled.div`
background-color: ${({theme})=>theme.bgLight};
width: 70px;
height: 15px;
`;

const Views = styled.div`
width:60px;
height: 15px;
background-color: ${({theme})=>theme.bgLight};
`;

const CardSkeleton = () => {
    return (
        <Card>
            <Top>
                <CardImage></CardImage>
            </Top>
            <CardInformation>
                <MainInfo>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Title></Title>
                    </div>

                    <CreatorsInfo>
                        <Creator>
                            <NameDiv ></NameDiv>
                            <CreatorName></CreatorName>
                        </Creator>
                        <Views></Views>
                    </CreatorsInfo>

                </MainInfo>
            </CardInformation>
        </Card>
    )
}

export default CardSkeleton