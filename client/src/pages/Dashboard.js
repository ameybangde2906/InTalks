import React from 'react'
import PodcastCards from '../components/common/PodcastCards'
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { type } = useParams()
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  return (

    <>
      <PodcastCards feedType={type} userId={authUser?._id} />
    </>
  )
}

export default Dashboard