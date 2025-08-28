import { request } from "@/config/request";
import { useQuery } from "@tanstack/react-query"

export const useSubject = () => {
    const token = JSON.parse(localStorage.getItem("token") || "{}")
    return useQuery({
        queryKey: ["Subjects"],
        queryFn: () =>
            request
                .get("/subjects", {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}` // Tokenni headerga qo'shamiz
                    }
                })
                .then((res) => res.data)
    });
};