import { useMutation } from "@tanstack/react-query"
import { request } from "../../../../config/request"

export const useLogin = () => {
    return useMutation({
        mutationFn: (values: {
            userName: string | undefined,
            password: string | undefined
        }) =>
            request
                .post("/auth/login", values)
                .then((res) => res.data)
    });
};