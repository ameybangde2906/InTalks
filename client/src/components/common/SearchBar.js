import React, { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { endPoint } from '../../utils/Constants'
import { SearchRounded } from '@mui/icons-material'
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const MainContainer = styled.div`
position: relative;
width: 45%;
margin-right: 6%;
`
const SearchBarContainer = styled.div`
border-radius: 15px;
width: 100%;
height: 37px;
display: flex;
justify-content: center;
align-items: center;
color:${({ theme }) => theme.text_secondary} !important;
background-color:${({ theme }) => theme.bg} !important;
border:1px solid ${({ theme }) => theme.text_secondary} !important ;
`
const SearchInput = styled.input`
padding-left: 10px;
border-top-left-radius: 15px;
border-bottom-left-radius: 15px;
width: 91%;
height: 95%;
border-right: 1px solid ${({ theme }) => theme.text_secondary} !important;
background-color:transparent;
font-size: 14px;
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

const SearchBar = () => {
    const [query, setQuery] = useState('');

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

    return (
        <>
            <MainContainer >
                <SearchBarContainer>
                    <SearchInput onChange={(e) => setQuery(e.target.value)} value={query} placeholder=' Search podcast here...'></SearchInput>

                    <div style={{ width: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <SearchButton onClick={() => searchResult()}>
                            <SearchRounded/>
                        </SearchButton>
                    </div>
                </SearchBarContainer>
                {data && <SearchResult>
                    {data?.map((podcast) => (<ul className='flex'>
                        <SearchRounded className='mr-3' />
                        <SearchList onClick={() => handleNavigation(podcast?._id)}>{podcast?.episodeName || podcast?.user?.fullname}</SearchList>
                    </ul>))}
                    {data.length === 0 && <li style={{ listStyleType: 'none' }}>No podcasts found...</li>}
                </SearchResult>}
            </MainContainer>

        </>
    )
}

export default SearchBar