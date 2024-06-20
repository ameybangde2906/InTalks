import { useMutation, useQueryClient } from '@tanstack/react-query';
import { endPoint } from '../utils/Constants';

const useFollow = () => {
    const queryClient = useQueryClient();

    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`${endPoint}/api/users/subscribe/${userId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                })

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Somthing went wrong")
                }
                return
            } catch (error) {
                throw new Error(error.message)
            }
        },
        onSuccess:()=>{
            Promise.all([
                queryClient.invalidateQueries({queryKey:["suggestedUsers"]}),
                queryClient.invalidateQueries({queryKey:["authUser"]})
            ])
        },
        onError:(error)=>{
            throw new Error(error.message)
        }
    })
    return {follow, isPending}
}

export default useFollow;