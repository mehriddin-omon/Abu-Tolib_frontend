import { Button } from "@/components/ui/button";
import { useSubject } from "./services/queries/useSubject";
import math from "@/assets/img/math.png";
import { useNavigate } from "react-router-dom";
import { STUDENT_ROUTES } from "@/utils/path";
import { Card, CardHeader, CardTitle, Separator } from "@/components";

interface Subject {
    id: string;
    name: string;
    topics: Array<{
        id: string;
        title: string;
    }>;
}

export const Subjects = () => {
    const { data, error, isLoading } = useSubject();
    const navigate = useNavigate();



    return (
        <>
            <CardHeader className="flex pt-13 pl-20 gap-3">
                <CardTitle className="italic font-extralight text-xl">
                    Barcha fanlar ro'yxati
                </CardTitle>
            </CardHeader>
            <Card className="pt-7 px-25 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-8 pb-10">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40 col-span-full">
                        <p className="text-gray-500">Loading...</p>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-40 col-span-full">
                        <p className="text-red-500">Xatolik: {error.message}</p>
                    </div>
                ) : (
                    data?.map((items: Subject) => (
                        <Card
                            key={items.id}
                            className="max-w-[298px] w-full flex flex-col items-center py-8 px-6 rounded-[var(--radius)] bg-[var(--bg-gradient-onyx)] shadow border cursor-pointer transition"
                        >
                            <img
                                src={math}
                                alt="math"
                                className="max-w-[201px] max-h-[152px] object-cover mb-2 rounded-[6px]"
                            />
                            <CardTitle className="pb-1 text-center">
                                {items.name}
                            </CardTitle>
                            <Separator className="bg-gray-800"/>
                            <div className="w-full px-4 py-3">
                                <div className="rounded-[3px] bg-[rgba(217,217,217,0.3)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] text-center">
                                    <p className="font-secondary font-normal text-[13px] leading-[130%] text-[var(--white1)]">
                                        {items.topics.length} ta test mavzular
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                size={"sm"}
                                className="mt-3 ml-auto"
                                onClick={() => {
                                    navigate(`${STUDENT_ROUTES.subjects}/${items.id}`, { state: items });
                                }}
                            >
                                <span>
                                    Kirish
                                </span>
                            </Button>
                        </Card>
                    ))
                )}
            </Card >
        </>
    );
};