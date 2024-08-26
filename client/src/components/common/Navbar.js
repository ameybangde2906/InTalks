import React, { useEffect } from 'react'
import styled from 'styled-components'
import { IconButton } from '@mui/material'
import { useQuery } from '@tanstack/react-query';
import { MenuRounded } from '@mui/icons-material'
import SignIn from '../../pages/Authentication/SignIn'
import LogoImage from "../../images/mic.png"
import { getInitials } from "../../utils/Initials"
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

const LogoDiv = styled.div`
display: flex;
align-items: center;
cursor: pointer;
font-weight: 800;
font-size: 18px;
color: ${({ theme }) => theme.primary};
display: none;
@media(max-width:1200px){
    display: flex;
    margin-left: -20px;
}
`
const Logo = styled.img`
width: 30px;
height: 30px;
margin-right: 5px;
`

const NavBarDiv = styled.div`
display:flex;
justify-content: space-between;
padding:16px 20px;
align-items:center;
background-color: ${({ theme }) => theme.bgLight};
gap:30px;
color:${({ theme }) => theme.text_primary};
box-shadow: 0 4px 30px rgba(0,0,0,0.1);
backdrop-filter:blur(5.7px);
-webkit-backdrop-filter:blur(5.7px);
z-index: 100;
width: 100%;
@media (max-width:768px){
    padding:16px;
}
`
const MenuButton = styled(IconButton)`
visibility:hidden;
color:${({ theme }) => theme.text_secondary} !important;
@media (max-width:1200px){
    visibility:visible;
}
`

const NameDiv = styled.div`
width: 35px;
height: 35px;
border-radius: 50%;
font-size: 18px;
font-weight: 700;
display: flex;
align-items: center;
justify-content: center;
color:${({ theme }) => theme.bg};
background-color: ${({ theme }) => theme.text_primary};
`
const ProfileImg = styled.img`
width: 35px;
height: 35px;
border-radius: 50%;
`
const UserCircle = styled.div`
margin: 0 2%;
`

const SignInButton = styled.div`
border-radius: 10px;

`
const Navbar = ({ menuOpen, setMenuOpen }) => {

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    useEffect(() => {
        if (authUser) {

        }
    }, [authUser])

    return (
        <NavBarDiv>
            <MenuButton onClick={() => setMenuOpen(!menuOpen)} >
                <MenuRounded />
            </MenuButton>
            <Link to='/'>
                <LogoDiv>
                    <Logo src={LogoImage} />
                    IT
                </LogoDiv>
            </Link>

            <SearchBar />
          
                {<UserCircle>
                    {authUser ?
                        <Link to={`/profile/${authUser._id}`} >
                            {authUser?.profileImage !== null  &&
                                <ProfileImg src={authUser?.profileImage} />
                            }
                            {(authUser?.profileImage === null) &&
                                <NameDiv >{getInitials(authUser?.fullname)}</NameDiv>}
                        </Link>
                        :
                        <SignInButton>
                            <SignIn />
                        </SignInButton>
                    }
                </UserCircle>}


        </NavBarDiv >

    )
}

export default Navbar