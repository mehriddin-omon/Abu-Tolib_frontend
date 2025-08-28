
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NotificationIcon } from "@/assets/svg"

export function Notification() {
    const notification = true;
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="relative cursor-pointer">
                    <NotificationIcon className="size-10" notification={notification} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 z-50 bg-white">
                <div className="font-semibold mb-2">Bildirishnomalar:</div>
                <div className="text-sm text-muted-foreground">Hozircha bildirishnoma yo‘q</div>
            </PopoverContent>
        </Popover>
    )
}