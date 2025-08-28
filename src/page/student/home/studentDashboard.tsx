import { Card } from "@/components";
import { useProfile } from "./service/query/useProfile";

export const StudentHome = () => {
    const { data, isLoading, error } = useProfile();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            <Card className="h-full">
                <h1 className="text-4xl font-bold text-center text-[#0d0d0d] mt-10">
                    Xush kelibsiz {data?.firstName} {data?.lastName}!
                </h1>
            </Card>

        </>
    )
}