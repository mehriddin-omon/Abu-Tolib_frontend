import { useNavigate, useParams } from "react-router-dom";
import { useGetTopic } from "./service/query/useGetTopic";
import { useState } from "react";
import { TestStartModal } from "../../components/modal/testStartModal";

export const Topics = () => {

    const [showModal, setShowModal] = useState(false);
    
    // useNavigate hook to navigate to different pages
    const navigate = useNavigate();
    const param = useParams<{ id: string }>();
    const {data, isLoading, error} = useGetTopic(param.id as string);

    if(error){
        return <div>Error: {error.message}</div>;
    }
    
    const handleStartTest = () => {
        setShowModal(true);
    }

    const confirmStartTest = () => {
        setShowModal(false);
        navigate(`/app/test/${param.id}`);
    }
    
    const closeModal = () => {
        setShowModal(false);
    }

    return (
        <>
            <div className="pt-3 pb-[13px] flex flex-col items-center rounded-[10px] bg-[rgba(106,129,255,0.8)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
                <h1 className="pt-5 font-primary italic font-extralight text-[35px] leading-[130%] text-[#fff]">
                    { isLoading
                    ? <>Loading...</>
                    : data.title }
                </h1>
                <button
                    className="mt-4.5 py-2 px-[11px] rounded-[15px] bg-[#6a81ff]"
                    onClick={handleStartTest}
                >
                    <span className="font-primary italic font-normal text-base leading-[100%] text-[#fff]">
                        Testni boshlash
                    </span>
                </button>
            </div>
            <TestStartModal
                isOpen={showModal}
                onConfirm={confirmStartTest}
                onClose={closeModal}
                topicTitle={data?.title}
            />
        </>
    )
}