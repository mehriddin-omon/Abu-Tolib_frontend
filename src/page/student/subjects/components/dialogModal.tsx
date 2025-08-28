import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { STUDENT_ROUTES } from "@/utils/path";
import { useNavigate } from "react-router-dom"
type Topic = {
    id: string;
    title: string;
}
export function DialogCloseButton({topic}: {topic: Topic}) {
    const navigate = useNavigate()
    const handleSubmit = () => {
        navigate(`${STUDENT_ROUTES.test}/${topic.id}`)
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="w-full"
                    size={'lg'}>
                    Boshlash
                </Button>
            </DialogTrigger>

            <DialogContent className="min-h-[200px] bg-[var(--bg)] dark:bg-gray-500">
                <DialogHeader>
                    <DialogTitle>{topic.title}</DialogTitle>
                    <DialogDescription>
                        Rostdan ham boshlamoqchimisiz
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="w-full items-center justify-between sm:justify-start">
                    {/* <DialogClose asChild>
                        <Button size={'lg'}>
                            Orqaga
                        </Button>
                    </DialogClose> */}
                    <Button
                        size={'lg'}
                        onClick={handleSubmit}
                        className="ml-auto"
                    >
                        Boshlash
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    )
}
