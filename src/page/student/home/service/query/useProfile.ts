import { request } from "@/config/request"
import { useQuery } from "@tanstack/react-query"

export const useProfile = () => {
    const token = JSON.parse(localStorage.getItem("token") || "{}")
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const res = await request.get('/users/my-profile', {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            });
            if (res.status !== 200) {
                throw new Error('Failed to fetch profile data');
            }
            return res.data;
        }

    })
}