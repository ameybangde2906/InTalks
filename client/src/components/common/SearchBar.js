import React, { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { endPoint } from '../../utils/Constants'
import { Close, SearchOutlined, SearchRounded } from '@mui/icons-material'
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const MainContainer = styled.div`
position: relative;
width: 50%;
@media (max-width:1000px) {
    width: 75%;
}

@media (max-width:600px) {
    width: 60%;
    display: none;
}
`
const SearchBarContainer = styled.div`
border-radius: 15px;
width: 100%;
height: 30px;
display: flex;
justify-content: center;
align-items: center;
color:${({ theme }) => theme.text_secondary} !important;
background-color:${({ theme }) => theme.bg} !important;
border:1px solid gray ;
`
const SearchInput = styled.input`
padding-left: 10px;
border-top-left-radius: 15px;
border-bottom-left-radius: 15px;
width: 91%;
height: 100%;
border-right: 1px solid ${({ theme }) => theme.text_secondary} !important;
background-color:transparent;
font-size: 13px;
outline: none;
`
const SearchButton = styled.button`
height: 100%;
color:${({ theme }) => theme.primary} !important;
`
const SearchResult = styled.div`
position: absolute;
margin-top: 1px;
border-radius: 15px;
font-size: 14px;
width: 100%;
min-height: 40px;
padding: 10px;
display: flex;
flex-direction: column;
justify-content: flex-start;
color:${({ theme }) => theme.text_secondary} !important;
background-color:${({ theme }) => theme.bg} !important;
border:1px solid ${({ theme }) => theme.text_secondary} !important ;
`
const SearchList = styled.li`
cursor: pointer;
height: 20px;
margin-bottom: 12px;
list-style-type: none;
background-color:${({ theme }) => theme.bg} !important;
color:${({ theme }) => theme.text_secondary} !important;
overflow:hidden;
display:-webkit-box;
max-width:100%;
-webkit-line-clamp:2;
-webkit-box-orient:vertical;
text-overflow:ellipsis;
text-transform: capitalize;
&:hover{
    color:${({ theme }) => theme.primary} !important;
}
`
const Search = styled.div`
display: none;
cursor: pointer;
@media (max-width:600px){
    display: block;
}
`

const SearchNav = styled.div`
width: 100%;
height: 70px;
position: absolute;
background-color: ${({ theme }) => theme.bg} !important;
z-index: 100;
top: 0;
right: 0;
display: none;
@media (max-width:600px){
    display: flex;
    align-items: center;
    justify-content: center;
}
`
const SearchInputTwo = styled.input`
padding-left: 10px;
width: 94%;
height: 30px;
font-size: 12px;
outline: none;
background-color: transparent;
`
const SearchInputBox = styled.div`
width: 92%;
background-color: ${({ theme }) => theme.bg};
border: 1px solid gray;
`
const SearchResultTwo = styled.div`
position: absolute;
top: 70px;
margin-top: 1px;
font-size: 12px;
width: 100%;
min-height: 40px;
padding: 10px;
display: flex;
flex-direction: column;
justify-content: flex-start;
color:${({ theme }) => theme.text_secondary} !important;
background-color:${({ theme }) => theme.bg} !important;
`

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [smallSearch, setSmallSearch] = useState(false)

    const fetchSearchResults = async () => {
        const response = await fetch(`${endPoint}/api/upload/search/${query}`)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };


    const navigate = useNavigate();
    const [debouncedQuery, setDebouncedQuery] = useState('');

    const handleSearch = useCallback(
        debounce((input) => {
            setDebouncedQuery(input);
        }, 500),
        []
    );

    const searchResult = () => {
        setQuery('')
        navigate(`/search/${query}`)
    }

    const handleNavigation = (podcastId) => {
        setQuery('')
        navigate(`/podcast/${podcastId}`);
    }

    useEffect(() => {
        if (data !== '') {
            handleSearch(query);
        }

    }, [query]);

    const { data } = useQuery({
        queryKey: ['searchResults', debouncedQuery],
        queryFn: fetchSearchResults,
        enabled: !!debouncedQuery,
    });

    const toggleSmallSearch = () => {
        setSmallSearch(true)
    }

    return (
        <>
            <MainContainer >
                <SearchBarContainer>
                    <SearchInput onChange={(e) => setQuery(e.target.value)} value={query} placeholder=' Search podcast here...'></SearchInput>

                    <div style={{ width: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <SearchButton onClick={() => searchResult()}>
                            <SearchRounded fontSize='medium' />
                        </SearchButton>
                    </div>


                </SearchBarContainer>
                {data && <SearchResult>
                    {data?.map((podcast) => (<ul className='flex'>
                        <SearchRounded className='mr-3' fontSize='small' />
                        <SearchList onClick={() => handleNavigation(podcast?._id)}>{podcast?.episodeName || podcast?.user?.fullname}</SearchList>
                    </ul>))}
                    {data.length === 0 && <li style={{ listStyleType: 'none' }}>No podcasts found...</li>}
                </SearchResult>}
            </MainContainer>


            <Search onClick={toggleSmallSearch} >
                <SearchOutlined fontSize='small'/>
            </Search>
            {smallSearch && <SearchNav>
                <SearchInputBox>
                    <SearchInputTwo onChange={(e) => setQuery(e.target.value)} value={query} placeholder=' Search podcast here...'></SearchInputTwo>
                    <SearchButton onClick={() => searchResult()}>
                        <SearchOutlined  sx={{ fontSize: 'large'}}/>
                    </SearchButton>
                </SearchInputBox>
                <SearchButton onClick={() => setSmallSearch(false)} style={{cursor:'pointer'}}><Close sx={{ fontSize: 'large', marginLeft: '10px' }} /></SearchButton>
                {data && <SearchResultTwo>
                    {data?.map((podcast) => (<ul className='flex'>
                        <SearchRounded className='mr-3' fontSize='small' />
                        <SearchList onClick={() => handleNavigation(podcast?._id)}>{podcast?.episodeName || podcast?.user?.fullname}</SearchList>
                    </ul>))}
                    {data.length === 0 && <li style={{ listStyleType: 'none' }}>No podcasts found...</li>}
                </SearchResultTwo>}
            </SearchNav>}
        </>
    )
}

export default SearchBar