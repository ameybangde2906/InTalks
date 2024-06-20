import React from 'react'
import PodcastCards from './PodcastCards'
import { useParams } from 'react-router-dom'

const SearchResult = () => {
    const {query}=useParams();

    
  return (
    <PodcastCards feedType={'search'} query={query}/>
  )
}

export default SearchResult