import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
  padding: 0 4%;
  height: 100%;
  font-family: Arial, sans-serif;
  overflow-x: auto;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin: 3%;
`;
const CoverImage = styled.div`
width: 94%;
height: 34%;
margin: 2% 2.5%;
border-radius: 20px;
background-color:${({ theme }) => theme.card};
@media (max-width:700px) {
  height: 80%;
  width: 100%;
  }
`
const ProfileImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color:${({ theme }) => theme.card};
  @media (max-width:700px) {
    width: 150px;
    height: 150px;
  }
`;

const ProfileDetails = styled.div`
padding: 3% 3%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  @media (max-width:700px) {
    padding: 0 7% 5% 7%;
  }
`;

const UserName = styled.h1`
background-color:${({ theme }) => theme.card};
border-radius: 15px;
height: 45px;
width: 250px;
`;

const UserDetails = styled.div`
background-color:${({ theme }) => theme.card};
margin-top: 4px;
width: 180px;
height: 15px;
border-radius: 15px;
`;

const CommonButton = styled.button`
background-color:${({ theme }) => theme.card};
margin-top: 20px;
padding: 6px 20px;
width: 100px;
height: 30px;
gap: 5px;
border-radius: 18px;
@media (max-width:700px) {
  width: 80px;
  }
`
const Buttons = styled.div`
display: flex;
margin-left: 4%;
gap: 2%;
margin-bottom: 30px;
`
const Button = styled.div`
width: 70px;
height: 30px;
background-color:${({ theme }) => theme.card};
`

const ProfileSkeleton = () => {
    return (
        <Container>
            <CoverImage />

            <ProfileSection>

                <ProfileImage />

                <ProfileDetails>
                    <UserName></UserName>
                    <UserDetails> </UserDetails>
                    <UserDetails> </UserDetails>

                    <div className='flex gap-3'>
                        <CommonButton />
                        <CommonButton />
                    </div>

                </ProfileDetails>
                
            </ProfileSection>

            <Buttons>
                <Button></Button>
                <Button></Button>
                <Button></Button>
                <Button></Button>
            </Buttons>

        </Container>
    )
}

export default ProfileSkeleton