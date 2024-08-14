import { endPoint } from '../utils/Constants';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react'

const useGetUploadData = (POST_ENDPOINTS, feedType, userId,query) => {
    const { data: uploads, isLoading: isgettingData, refetch, isError, isRefetching:isRefetchingData } = useQuery({
        queryKey: ["uploads"],
        queryFn: async () => {
            const res = await fetch(`${endPoint}${POST_ENDPOINTS}`);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Something went wrong");
            }
            return res.json();
        }, 
        retry:false
    });

    useEffect(() => {
            refetch();
    }, [feedType, refetch, userId,query])

    return { uploads, isgettingData, refetch,isError, isRefetchingData }
}

export default useGetUploadData