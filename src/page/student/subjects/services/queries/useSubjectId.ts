import { useQuery } from "@tanstack/react-query";
import { request } from "@/config/request";

export const useSubjectId = () => {
    const token = JSON.parse(localStorage.getItem("token") || "{}");
    return useQuery({
        queryKey: ["SubjectId"],
        queryFn: () =>
            request
                .get("/subjects/:id", {
                    headers: {
                        Authorization: `Bearer ${token.accessToken}` // Tokenni headerga qo'shamiz
                    }
                })
                .then((res) => res.data)
    });
}