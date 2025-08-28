import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Card,
    ModeToggle,
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    Notification,
    SidebarTrigger
} from "@/components"

export const HomeNavbar = () => {
    return (
        <Card className="w-full bg-[var(--bg)] sticky top-0">
            <NavigationMenu className="flex justify-between px-5">
                <SidebarTrigger className="-ml-1"/>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Notification />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <ModeToggle/>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/user/profile">
                            <Avatar >
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>PR</AvatarFallback>
                            </Avatar>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </Card>
    )
}