import React from 'react'
import styled from 'styled-components'

const Details = styled.div`
color: ${({ theme }) => theme.text_secondary};
width: 100%;
padding: 10px;
`
const PodcastName = styled.div`
margin-bottom: 10px;
width: 100%;
height: 55px;
background-color:${({ theme }) => theme.card};
border-radius: 20px;
`
const ProfileImg = styled.div`
border-radius: 50%;
width: 40px;
height: 40px;
background-color:${({ theme }) => theme.card};
`
const OwnerInfo = styled.div`
display: flex;
flex-direction: row;
align-items: center;
margin-top: 10px;
`
const Name = styled.div`
width: 170px;
height: 30px;
background-color:${({ theme }) => theme.card};
margin-left: 5px;
border-radius: 20px;
`

const OwnerDetailSkeleton = () => {
    return (
        <Details>

            <PodcastName></PodcastName>
            <OwnerInfo>

                <div className='flex'>

                    <ProfileImg>

                    </ProfileImg>

                    <div >
                        <Name></Name>
                    </div>

                </div>

            </OwnerInfo>

        </ Details>
    )
}

export default OwnerDetailSkeleton