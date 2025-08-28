import { useQuery } from '@tanstack/react-query';
import { request } from '../../../../config/request';

export const useGetTopic = (topicId: string) => {
    
    const token = JSON.parse(localStorage.getItem('token') || '{}')

    if (!token || !token.accessToken) {
        throw new Error('Access token is not available');
    }
    return useQuery({
        queryKey: ['Topic'],
        queryFn: () =>
            request
                .get(`/topics/${topicId}`, {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}` // Tokenni headerga qo'shamiz
                    }
                })
                .then((res) => res.data),
    })
}