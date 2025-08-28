import { Outlet } from "react-router-dom"
import { Card, SidebarProvider } from "@/components"
import { UserSidebar } from "./components/userSidebar"
import { HomeNavbar } from "./components/userNavbar"

export default function UserLayout() {
    return (
        // <Card className="w-full mx-auto py-0">
            <SidebarProvider>
                <UserSidebar />  
                <Card className="w-full px-0 py-0 gap-4">
                    <HomeNavbar />
                    <Outlet />
                </Card>
            </SidebarProvider>
        // </Card>
    )
}