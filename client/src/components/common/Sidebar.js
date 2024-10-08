import { CloseRounded, DarkModeRounded, FavoriteRounded, HomeRounded, LightModeRounded,MovieSharp, MusicNote, TrendingUp, GamepadSharp, SportsBaseball, ShoppingCart, CloudUpload, Business, TheaterComedy } from '@mui/icons-material'
import React from 'react'
import styled from 'styled-components'
import LogoImage from "../../images/mic.png"
import { Link } from 'react-router-dom'
import UploadPodcast from '../../pages/profile/UploadPodcast'
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { openSignin } from '../../redux/slices/setSignInSlice'
import Footer from './Footer'

const MenuContainer = styled.div`
flex:0.5;
flex-direction: column;
height:100vh;
background-color: ${({ theme }) => theme.bg};
color:${({ theme }) => theme.text_primary};
 @media (max-width:1200px){
    position:fixed;
    z-index:1000;
    width:100%;
    max-width:250px;
    left: ${({ menuOpen }) => (menuOpen ? "0" : "-100%")};
    transition :0.3s ease-in-out;
}
overflow-y:auto ;
`;

const Flex = styled.div`
width:100%;
display:flex;
flex-direction:row;
align-items:center;
justify-content:space-between;
padding:0px 6px;
`;

const Logo = styled.div`
color: ${({ theme }) => theme.primary};
display:flex;
align-items:center;
justify-content:center;
gap:0px;
font-weight:bold;
font-size:18px;
padding:5px 10px;
`;

const Image = styled.img`
height:30px;
margin: 7px;
`;

const Close = styled.div`
display:none;
cursor: pointer;
@media (max-width:1100px){
    display:block;
}
`;

const Elements = styled.div`
padding:2px 26px;
font-size: 14px;
font-weight: 500;
display:flex;
flex-direction:row;
justify-content:flex-start;
align-items:center;
gap:12px;
cursor:pointer;
color:${({ theme }) => theme.text_secondary};
&:hover{
    color: ${({ theme }) => theme.hover};
    background: ${({ theme }) => theme.button_text}
}
`;

const NavText = styled.div`
padding: 11px 0px;
`

const HR = styled.div`
width:100%;
height:1px;
background-color: ${({ theme }) => theme.text_secondary + 50};
margin:3px 0px;
`;

const Explore = styled.div`
padding:8px 0 8px 26px;
font-size: 15px;
font-weight: 500;
display:flex;
flex-direction:column;
color:${({ theme }) => theme.text_secondary};
`

const ExploreDiv = styled.div`
padding:0px 26px;
display:flex;
flex-direction:row;
justify-content:flex-start;
align-items:center;
font-size: 13px;
gap:12px;
cursor:pointer;
color:${({ theme }) => theme.text_secondary};
&:hover{
    color: ${({ theme }) => theme.hover};
    background: ${({ theme }) => theme.button_text}
}
`

const Sidebar = ({ menuOpen, setMenuOpen, toggleFn, savedMode }) => {
    const dispatch = useDispatch()
    const { data: authUser } = useQuery({ queryKey: ["authUser"] })

    const handleSignIn = () => {
        dispatch(openSignin())
    }

    return (

        <MenuContainer menuOpen={menuOpen}>

            <Flex>
                <Link to='/' onClick={() => setMenuOpen(false)}>
                    <Logo>
                        <Image src={LogoImage} />
                        InTalks
                    </Logo>
                </Link>

                <Close onClick={() => setMenuOpen(false)}>
                    <CloseRounded />
                </Close>
            </Flex>

            <Link to='/' >
                <Elements>
                    <HomeRounded fontSize='medium' />
                    <NavText>Home</NavText>
                </Elements>
            </Link>

            {authUser ?
                <Link to='/favorites' >
                    <Elements>
                        <FavoriteRounded fontSize='medium' />
                        <NavText>Favorites</NavText>
                    </Elements>
                </Link>
                :
                <Elements onClick={handleSignIn}>
                    <FavoriteRounded fontSize='medium'/>
                    <NavText>Favorites</NavText>
                </Elements>
            }


            <HR />

            <Explore>Explore </Explore>

            <Link to='/trending'>
                <ExploreDiv>
                    <TrendingUp fontSize='small'/>
                    <NavText>Trending</NavText>
                </ExploreDiv>
            </Link>

            <Link to='/music'>
                <ExploreDiv>
                    <MusicNote fontSize='small'/>
                    <NavText>Music</NavText>
                </ExploreDiv>
            </Link>

            <Link to='/movies'>
                <ExploreDiv>
                    <MovieSharp fontSize='small'/>
                    <NavText>Movies</NavText>
                </ExploreDiv>
            </Link>
            <Link to='/comedy'>
                <ExploreDiv>
                    <TheaterComedy fontSize='small'/>
                    <NavText>Comedy</NavText>
                </ExploreDiv>
            </Link>

            <Link to='/business'>
                <ExploreDiv>
                    <Business fontSize='small'/>
                    <NavText>Business</NavText>
                </ExploreDiv>
            </Link>

            <Link to='/gaming'>
                <ExploreDiv>
                    <GamepadSharp fontSize='small'/>
                    <NavText>Gaming</NavText>
                </ExploreDiv>
            </Link>

            <Link to='/sports'>
                <ExploreDiv>
                    <SportsBaseball fontSize='small'/>
                    <NavText>Sports</NavText>
                </ExploreDiv>
            </Link>

            <Link to='/fashion'>
                <ExploreDiv>
                    <ShoppingCart fontSize='small'/>
                    <NavText>Fashion</NavText>
                </ExploreDiv>
            </Link>

            <HR />

            <Elements onClick={() => toggleFn()}>
                {savedMode ? <DarkModeRounded fontSize='medium'/> : <LightModeRounded fontSize='medium' />}
                <NavText>{savedMode ? 'Dark Mode' : 'Light Mode'}</NavText>
            </Elements>

            {authUser ?
                <div>
                    <UploadPodcast />
                </div>
                :
                <Elements onClick={handleSignIn}>
                    <CloudUpload fontSize='medium'/> <NavText>Upload</NavText>
                </Elements>
            }
             <Footer/>
        </MenuContainer>
    )
}

export default Sidebar
