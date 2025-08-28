import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetTopic } from "../../topics/service/query/useGetTopic";
import { Button, Card, Progress } from "@/components";

interface Answer {
    id: string;
    name: string;
    isCorrect: boolean;
}

interface Question {
    id: string;
    text: string;
    answers: Answer[];
}

interface UserAnswer {
    questionId: string;
    answerId: string;
}

export const Tests = () => {
    const param = useParams<{ topicId: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetTopic(param.topicId as string);
    // console.log('param', data);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [timeLeft, setTimeLeft] = useState(60); // 1 minut
    const [isTestCompleted, setIsTestCompleted] = useState(false);

    // Timer
    useEffect(() => {
        if (timeLeft > 0 && !isTestCompleted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            handleTestComplete();
        }
    }, [timeLeft, isTestCompleted]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (answerId: string) => {
        setSelectedAnswer(answerId);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer) {
            // Javobni saqlash
            const newAnswer: UserAnswer = {
                questionId: data?.questions[currentQuestionIndex]?.id,
                answerId: selectedAnswer
            };

            setUserAnswers(prev => {
                const filtered = prev.filter(a => a.questionId !== newAnswer.questionId);
                return [...filtered, newAnswer];
            });

            // Keyingi savolga o'tish
            if (currentQuestionIndex < data?.questions?.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer("");
            } else {
                handleTestComplete();
            }
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            // Oldingi javobni ko'rsatish
            const previousAnswer = userAnswers.find(
                a => a.questionId === data?.questions[currentQuestionIndex - 1]?.id
            );
            setSelectedAnswer(previousAnswer?.answerId || "");
        }
    };

    const handleTestComplete = () => {
        setIsTestCompleted(true);
        // Test natijasini hisoblash va saqlash
        calculateResults();
    };

    const calculateResults = () => {
        if (!data?.questions) return;

        let correctAnswers = 0;
        userAnswers.forEach(userAnswer => {
            const question = data.questions.find((q: Question) => q.id === userAnswer.questionId);
            const answer = question?.variants.find((a: Answer) => a.id === userAnswer.answerId);
            if (answer?.isCorrect) {
                correctAnswers++;
            }
        });

        const score = Math.round((correctAnswers / data.questions.length) * 100);

        // Natijani saqlash yoki API ga jo'natish
        console.log('userAnswer', {
            topicId: param.topicId,
            totalQuestions: data.questions.length,
            userAnswers,
            score,
            timeSpent: 60 - timeLeft
        });
    };

    const restartTest = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setSelectedAnswer("");
        setTimeLeft(60);
        setIsTestCompleted(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-primary">Yuklanmoqda...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-xl font-primary text-red-600">Xatolik yuz berdi</div>
            </div>
        );
    }

    if (!data?.questions?.length) {
        return (
            <Card className="flex items-center justify-center h-full">
                <div className="text-xl font-primary">Savollar topilmadi</div>
            </Card>
        );
    }

    if (isTestCompleted) {
        const correctAnswers = userAnswers.filter(userAnswer => {
            const question = data.questions.find((q: Question) => q.id === userAnswer.questionId);
            const answer = question?.variants.find((a: Answer) => a.id === userAnswer.answerId);
            return answer?.isCorrect;
        }).length;
        console.log('javoblar', correctAnswers)

        const score = Math.round((correctAnswers / data.questions.length) * 100);

        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h1 className="text-3xl font-primary font-bold mb-6 text-gray-800">
                        Test yakunlandi!
                    </h1>
                    <div className="mb-6">
                        <div className="text-6xl font-bold text-blue-600 mb-2">{score}%</div>
                        <div className="text-gray-600">
                            {correctAnswers} / {data.questions.length} to'g'ri javob
                        </div>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={restartTest}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Qayta urinish
                        </button>
                        <button
                            onClick={() => navigate('/app/subjects')}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Asosiy sahifaga qaytish
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = data.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / data.questions.length) * 100;

    return (
        <Card className="flex flex-row justify-between w-full h-full px-5 bg-[var(--ring)]">
            <div className="w-full flex flex-col justify-between">
                {/* Header */}
                <Card className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-primary font-semibold text-gray-800">
                            {data.title}
                        </h1>
                    </div>
                    {/* Progress bar */}
                    <Progress value={progress} />
                    <div className="text-sm text-gray-600 text-center">
                        Savol {currentQuestionIndex + 1} / {data.questions.length}
                    </div>

                    {/* Question */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-primary font-medium text-gray-800 mb-6">
                            {currentQuestion.text}
                        </h2>
                        {/* Answers */}
                        <div className="space-y-3">
                            {currentQuestion.variants?.map((item: Answer, index: number) => (
                                <div
                                    key={item.id}
                                    className={`p-2 border-2 rounded-lg cursor-pointer transition-all duration-200 ${selectedAnswer === item.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => handleAnswerSelect(item.id)}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${selectedAnswer === item.id
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-400'
                                            }`}>
                                            {selectedAnswer === item.id && (
                                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                            )}
                                        </div>
                                        <div className="flex gap-3 font-secondary font-normal text-2xl text-gray-700 ">
                                            {String.fromCharCode(65 + index)}.
                                            <span className="">
                                                {item.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </Card>



                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <Button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant={'primary'}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Oldingisi
                    </Button>

                    <div className="text-sm text-gray-600">
                        Javob berilgan: {userAnswers.length} / {data.questions.length}
                    </div>

                    <Button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                        variant={'primary'}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {currentQuestionIndex === data.questions.length - 1 ? 'Yakunlash' : 'Keyingisi'}
                    </Button>
                </div>
            </div>

            {/* Questions overview */}
            <Card className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-primary font-semibold mb-4 text-gray-800">
                    Qolgan vaqt
                </h3>
                <div className="text-lg font-mono font-bold text-red-600">
                    {formatTime(timeLeft)}
                </div>

                <h3 className="text-lg font-primary font-medium mb-4 text-gray-800">
                    Savollar holati
                </h3>
                <div className="grid grid-cols-5 gap-[20px]">
                    {data.questions.map((_: Question, index: number) => {
                        const isAnswered = userAnswers.some(
                            a => a.questionId === data.questions[index].id
                        );
                        const isCurrent = index === currentQuestionIndex;

                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentQuestionIndex(index);
                                    const existingAnswer = userAnswers.find(
                                        a => a.questionId === data.questions[index].id
                                    );
                                    setSelectedAnswer(existingAnswer?.answerId || "");
                                }}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${isCurrent
                                    ? 'bg-blue-600 text-white'
                                    : isAnswered
                                        ? 'bg-green-200 text-green-800'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            </Card>
        </Card>
    );
};